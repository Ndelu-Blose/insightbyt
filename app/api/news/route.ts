import { NextRequest, NextResponse } from "next/server";
import { Filters, NewsResponse } from "@/lib/news/types";
import { getCountriesForRegion, REGION_TO_COUNTRIES } from "@/lib/news/region-map";
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
    const time = validateOptionalEnum(searchParams.get("time"), VALID_TIME_RANGES);
    const sort = validateEnum(searchParams.get("sort"), VALID_SORT_OPTIONS, "publishedAt");
    
    // Extract filters from query params
    const filters: Filters = {
      q,
      category,
      country,
      region,
      time,
      sort,
    };
    
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
    } else if (filters.region) {
      // If region is specified, get all countries in that region
      countriesToFetch = getCountriesForRegion(filters.region);
      
      // Security: Limit parallel requests to prevent DoS
      if (countriesToFetch.length > MAX_PARALLEL_REQUESTS) {
        countriesToFetch = countriesToFetch.slice(0, MAX_PARALLEL_REQUESTS);
      }
    } else {
      // Default: fetch from all available countries (or use a default)
      // For now, we'll fetch without country filter (global news)
      countriesToFetch = [];
    }
    
    // Fetch news for each country and merge results
    let allArticles: any[] = [];
    
    if (countriesToFetch.length === 0) {
      // Fetch without country filter (global)
      // Remove country from filters if it exists
      const { country, ...filtersWithoutCountry } = filters;
      const articles = await fetchNews(filtersWithoutCountry);
      allArticles = articles;
    } else {
      // Security: Limit parallel requests to prevent DoS
      const countriesToProcess = countriesToFetch.slice(0, MAX_PARALLEL_REQUESTS);
      
      // Fetch for each country and merge
      // When fetching by region, ensure category is included (default to 'general' if not specified)
      const fetchPromises = countriesToProcess.map((country) => {
        const filtersForCountry = {
          ...filters,
          country,
          // Ensure category is set when fetching by region (required for top-headlines endpoint)
          category: filters.category || 'general'
        };
        return fetchNews(filtersForCountry);
      });
      
      const results = await Promise.allSettled(fetchPromises);
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          allArticles.push(...result.value);
        } else {
          // Don't expose internal error details to clients
          console.error("Failed to fetch news for country:", result.reason);
        }
      }
    }
    
    // Remove duplicates based on article ID
    const uniqueArticles = Array.from(
      new Map(allArticles.map((article) => [article.id, article])).values()
    );
    
    // Cluster similar articles
    const clustered = clusterArticles(uniqueArticles);
    
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
    
    const response: NewsResponse = {
      filters,
      total: sorted.length,
      items: sorted,
    };
    
    return NextResponse.json(response, {
      headers: {
        "Cache-Control": "public, s-maxage=300, stale-while-revalidate=600",
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

