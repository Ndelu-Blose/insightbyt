import { NextRequest, NextResponse } from "next/server";
import { Filters, NewsResponse } from "@/lib/news/types";
import { getCountriesForRegion, REGION_TO_COUNTRIES, getProvincesForCountry, getProvinceName } from "@/lib/news/region-map";
import { fetchNews } from "@/lib/news/provider";
import { clusterArticles } from "@/lib/news/cluster";

// Security constants
const MAX_QUERY_LENGTH = 200;
const MAX_PARALLEL_REQUESTS = 10; // Limit to prevent DoS

// Valid categories from NewsAPI
const VALID_CATEGORIES = [
  "business",
  "entertainment",
  "general",
  "health",
  "science",
  "sports",
  "technology",
];

// Valid country codes (ISO 3166-1 alpha-2)
const VALID_COUNTRIES = [
  "ae", "ar", "at", "au", "be", "bg", "br", "ca", "ch", "cn", "co", "cu",
  "cz", "de", "eg", "fr", "gb", "gr", "hk", "hu", "id", "ie", "il", "in",
  "it", "jp", "kr", "lt", "lv", "ma", "mx", "my", "ng", "nl", "no", "nz",
  "ph", "pl", "pt", "ro", "rs", "ru", "sa", "se", "sg", "si", "sk", "th",
  "tr", "tw", "ua", "us", "ve", "za", "gh", "ke", "qa",
];

// Valid regions
const VALID_REGIONS = Object.keys(REGION_TO_COUNTRIES);

// Valid time ranges
const VALID_TIME_RANGES = ["24h", "7d", "30d"] as const;

// Valid sort options
const VALID_SORT_OPTIONS = ["publishedAt", "relevancy"] as const;

/**
 * Sanitize and validate query string
 */
function sanitizeQuery(query: string | null): string | undefined {
  if (!query) return undefined;
  
  // Limit length to prevent DoS
  if (query.length > MAX_QUERY_LENGTH) {
    throw new Error(`Query string too long (max ${MAX_QUERY_LENGTH} characters)`);
  }
  
  // Remove potentially harmful characters and trim
  const sanitized = query.trim().slice(0, MAX_QUERY_LENGTH);
  
  // Basic validation: reject empty strings after sanitization
  return sanitized.length > 0 ? sanitized : undefined;
}

/**
 * Validate enum values against whitelist
 */
function validateEnum<T extends string>(
  value: string | null,
  validValues: readonly T[],
  defaultValue: T
): T {
  if (!value) return defaultValue;
  return validValues.includes(value as T) ? (value as T) : defaultValue;
}

/**
 * Validate optional enum values
 */
function validateOptionalEnum<T extends string>(
  value: string | null,
  validValues: readonly T[]
): T | undefined {
  if (!value) return undefined;
  return validValues.includes(value as T) ? (value as T) : undefined;
}

/**
 * Validate country code
 */
function validateCountry(country: string | null): string | undefined {
  if (!country) return undefined;
  const lowerCountry = country.toLowerCase();
  return VALID_COUNTRIES.includes(lowerCountry) ? lowerCountry : undefined;
}

/**
 * Validate category
 */
function validateCategory(category: string | null): string | undefined {
  if (!category) return undefined;
  const lowerCategory = category.toLowerCase();
  return VALID_CATEGORIES.includes(lowerCategory) ? lowerCategory : undefined;
}

/**
 * Validate region
 */
function validateRegion(region: string | null): string | undefined {
  if (!region) return undefined;
  const lowerRegion = region.toLowerCase();
  return VALID_REGIONS.includes(lowerRegion) ? lowerRegion : undefined;
}

/**
 * Validate province
 */
function validateProvince(province: string | null, country?: string): string | undefined {
  if (!province) return undefined;
  const lowerProvince = province.toLowerCase();
  
  // If country is specified, validate province belongs to that country
  if (country) {
    const validProvinces = getProvincesForCountry(country);
    return validProvinces.includes(lowerProvince) ? lowerProvince : undefined;
  }
  
  // Otherwise, check if it's a valid province code in any country
  const allProvinces = Object.values(REGION_TO_COUNTRIES).flatMap((countries) =>
    countries.flatMap((c) => getProvincesForCountry(c))
  );
  return allProvinces.includes(lowerProvince) ? lowerProvince : undefined;
}

export async function GET(request: NextRequest) {
  try {
    // Check request URL length to prevent DoS
    const url = request.nextUrl.toString();
    if (url.length > 2000) {
      return NextResponse.json(
        { error: "Request URL too long" },
        { status: 400 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    
    // Sanitize and validate all inputs
    let q: string | undefined;
    try {
      q = sanitizeQuery(searchParams.get("q"));
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : "Invalid query parameter" },
        { status: 400 }
      );
    }
    
    const category = validateCategory(searchParams.get("category"));
    const country = validateCountry(searchParams.get("country"));
    const region = validateRegion(searchParams.get("region"));
    const province = validateProvince(searchParams.get("province"), country);
    const time = validateOptionalEnum(searchParams.get("time"), VALID_TIME_RANGES);
    const sort = validateEnum(searchParams.get("sort"), VALID_SORT_OPTIONS, "publishedAt");
    
    console.log("[API] Received query params:", {
      q: searchParams.get("q"),
      category: searchParams.get("category"),
      country: searchParams.get("country"),
      region: searchParams.get("region"),
      province: searchParams.get("province"),
      time: searchParams.get("time"),
      sort: searchParams.get("sort"),
    });
    
    // Extract filters from query params
    const filters: Filters = {
      q,
      category,
      country,
      region,
      province,
      time,
      sort,
    };
    
    console.log("[API] Processed filters:", JSON.stringify(filters));
    
    // Check API key
    if (!process.env.NEWS_API_KEY) {
      return NextResponse.json(
        { error: "NEWS_API_KEY is not configured" },
        { status: 500 }
      );
    }
    
    // Determine countries to fetch
    let countriesToFetch: string[] = [];
    
    if (filters.country) {
      // If country is specified, use only that country
      countriesToFetch = [filters.country];
      console.log("[API] Fetching for country:", filters.country);
    } else if (filters.region) {
      // If region is specified, get all countries in that region
      countriesToFetch = getCountriesForRegion(filters.region);
      console.log("[API] Region filter:", filters.region, "-> Countries:", countriesToFetch);
      
      // Security: Limit parallel requests to prevent DoS
      if (countriesToFetch.length > MAX_PARALLEL_REQUESTS) {
        countriesToFetch = countriesToFetch.slice(0, MAX_PARALLEL_REQUESTS);
      }
    } else {
      // Default: fetch from all available countries (or use a default)
      // For now, we'll fetch without country filter (global news)
      countriesToFetch = [];
      console.log("[API] No region/country filter, fetching global news");
    }
    
    // Fetch news for each country and merge results
    let allArticles: any[] = [];
    
    if (countriesToFetch.length === 0) {
      // Fetch without country filter (global)
      // When there's a query, we can still fetch with country context via query enhancement
      // Remove region from filters since fetchNews doesn't use it
      const { region, ...filtersWithoutRegion } = filters;
      const articles = await fetchNews(filtersWithoutRegion);
      allArticles = articles;
    } else {
      // Security: Limit parallel requests to prevent DoS
      const countriesToProcess = countriesToFetch.slice(0, MAX_PARALLEL_REQUESTS);
      
      // Fetch for each country and merge
      // When fetching by region, ensure category is included (default to 'general' if not specified)
      const fetchPromises = countriesToProcess.map(async (country) => {
        // Remove region from filters since fetchNews doesn't use it - only country matters
        const { region, ...filtersWithoutRegion } = filters;
        const filtersForCountry = {
          ...filtersWithoutRegion,
          country,
          // Ensure category is set when fetching by region (required for top-headlines endpoint)
          category: filters.category || 'general'
        };
        console.log("[API] Fetching for country:", country, "with filters:", JSON.stringify(filtersForCountry));
        
        try {
          const articles = await fetchNews(filtersForCountry);
          // If specific category returns no results and we have a category filter, try 'general' as fallback
          if (articles.length === 0 && filters.category && filters.category !== 'general') {
            console.log(`[API] No articles for ${country} with category ${filters.category}, trying 'general' category`);
            const fallbackFilters = { ...filtersForCountry, category: 'general' };
            const fallbackArticles = await fetchNews(fallbackFilters);
            return fallbackArticles;
          }
          return articles;
        } catch (error) {
          console.error(`[API] Error fetching for ${country}:`, error);
          // If specific category fails, try 'general' as fallback
          if (filters.category && filters.category !== 'general') {
            console.log(`[API] Error with category ${filters.category} for ${country}, trying 'general' category`);
            try {
              const fallbackFilters = { ...filtersForCountry, category: 'general' };
              return await fetchNews(fallbackFilters);
            } catch (fallbackError) {
              console.error(`[API] Fallback also failed for ${country}:`, fallbackError);
              throw error; // Throw original error
            }
          }
          throw error;
        }
      });
      
      const results = await Promise.allSettled(fetchPromises);
      
      let successCount = 0;
      let failureCount = 0;
      
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        const country = countriesToProcess[i];
        
        if (result.status === "fulfilled") {
          const articles = result.value;
          console.log(`[API] Successfully fetched ${articles.length} articles for country: ${country}`);
          if (articles.length > 0) {
            allArticles.push(...articles);
            successCount++;
          } else {
            console.warn(`[API] Country ${country} returned 0 articles (this is normal if no news available)`);
          }
        } else {
          failureCount++;
          // Log full error details server-side
          console.error(`[API] Failed to fetch news for country ${country}:`, result.reason);
          if (result.reason instanceof Error) {
            console.error("[API] Error message:", result.reason.message);
            console.error("[API] Error stack:", result.reason.stack);
          }
        }
      }
      
      console.log(`[API] Summary: ${successCount} countries succeeded, ${failureCount} countries failed, ${allArticles.length} total articles`);
    }
    
    console.log("[API] Total articles fetched before deduplication:", allArticles.length);
    
    // Remove duplicates based on article ID
    const uniqueArticles = Array.from(
      new Map(allArticles.map((article) => [article.id, article])).values()
    );
    
    console.log("[API] Unique articles after deduplication:", uniqueArticles.length);
    
    // Filter by province if specified (client-side filtering since NewsAPI doesn't support provinces directly)
    let filteredArticles = uniqueArticles;
    if (filters.province && filters.country) {
      const validProvinces = getProvincesForCountry(filters.country);
      if (validProvinces.includes(filters.province)) {
        // Filter articles that mention the province in title, description, or content
        // This is a simple text-based filter - in production, you might want more sophisticated matching
        const provinceDisplayName = getProvinceName(filters.province);
        const provinceCodeLower = filters.province.toLowerCase();
        const provinceNameLower = provinceDisplayName.toLowerCase();
        
        filteredArticles = uniqueArticles.filter((article) => {
          const searchText = `${article.title} ${article.description || ""}`.toLowerCase();
          
          // Check if province code or name appears in article
          return (
            searchText.includes(provinceCodeLower) ||
            searchText.includes(provinceNameLower) ||
            article.province === filters.province
          );
        });
      }
    }
    
    // Cluster similar articles
    const clustered = clusterArticles(filteredArticles);
    
    // Sort by sort parameter
    let sorted = [...clustered];
    if (filters.sort === "publishedAt") {
      // Sort by publishedAt (newest first) for latest news
      sorted.sort((a, b) => {
        const dateA = new Date(a.publishedAt).getTime();
        const dateB = new Date(b.publishedAt).getTime();
        return dateB - dateA; // Newest first
      });
    } else if (filters.sort === "relevancy") {
      // For relevancy, keep clusters first (they're more relevant)
      sorted.sort((a, b) => {
        const aIsCluster = "articles" in a;
        const bIsCluster = "articles" in b;
        if (aIsCluster && !bIsCluster) return -1;
        if (!aIsCluster && bIsCluster) return 1;
        return 0;
      });
    }
    
    console.log("[API] Final response:", { total: sorted.length, filters: JSON.stringify(filters) });
    
    const response: NewsResponse = {
      filters,
      total: sorted.length,
      items: sorted,
    };

    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (error) {
    // Log full error details server-side only
    console.error("Error fetching news:", error);
    
    // Return sanitized error messages to prevent information leakage
    if (error instanceof Error) {
      // Handle specific error types with appropriate status codes
      if (error.message.includes("Rate limit") || error.message.includes("429")) {
        return NextResponse.json(
          { error: "Rate limit exceeded. Please try again later." },
          { status: 429 }
        );
      }
      if (error.message.includes("API key") || error.message.includes("401")) {
        // Don't expose API key configuration details to clients
        return NextResponse.json(
          { error: "Service configuration error" },
          { status: 500 }
        );
      }
      // For validation errors (400 status), we can be more specific
      if (error.message.includes("too long") || error.message.includes("Invalid")) {
        return NextResponse.json(
          { error: error.message },
          { status: 400 }
        );
      }
      // For all other errors, return generic message
      return NextResponse.json(
        { error: "Failed to fetch news. Please try again later." },
        { status: 500 }
      );
    }
    
    // Generic error for unknown error types
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

