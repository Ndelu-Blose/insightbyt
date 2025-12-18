import { Article, Filters } from "./types";
import { normalizeArticle } from "./normalize";

const NEWS_API_BASE_URL = "https://newsapi.org/v2";

export async function fetchNews(
  filters: Filters & { country?: string }
): Promise<Article[]> {
  const provider = process.env.NEWS_PROVIDER || "newsapi";
  
  if (provider === "newsapi") {
    return fetchNewsAPI(filters);
  }
  
  throw new Error(`Unsupported news provider: ${provider}`);
}

async function fetchNewsAPI(
  filters: Filters & { country?: string }
): Promise<Article[]> {
  const apiKey = process.env.NEWS_API_KEY;
  
  if (!apiKey) {
    throw new Error("NEWS_API_KEY is not set in environment variables");
  }
  
  // Determine which endpoint to use
  const hasQuery = !!filters.q;
  const hasCategory = !!filters.category;
  const hasCountry = !!filters.country;
  
  // Use 'everything' endpoint if we have a search query, otherwise use 'top-headlines'
  // BUT: top-headlines requires at least one of: country, category, or sources
  // If we don't have any of these, default to 'general' category for top-headlines
  let effectiveCategory = filters.category;
  let effectiveCountry = filters.country;
  
  if (!hasQuery && !hasCategory && !hasCountry) {
    // No filters provided - use default category 'general' for top-headlines
    effectiveCategory = "general";
  } else if (!hasCategory && hasCountry) {
    // Country specified but no category - use 'general' as default for top-headlines
    effectiveCategory = "general";
  }
  
  const hasRequiredForTopHeadlines = !!effectiveCategory || !!effectiveCountry;
  const endpoint = hasQuery || !hasRequiredForTopHeadlines ? "everything" : "top-headlines";
  
  const params = new URLSearchParams();
  
  if (endpoint === "everything") {
    // For 'everything' endpoint, we need at least a query
    let queryText = filters.q || "";
    
    // Enhance query with province name if province is specified
    if (filters.province && !filters.q?.toLowerCase().includes(filters.province.toLowerCase())) {
      // Import province name mapping (we'll need to add this)
      // For now, convert province code to readable name
      const provinceName = filters.province
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
      
      // Add province to query if not already present
      if (queryText) {
        queryText = `${queryText} ${provinceName}`;
      } else {
        queryText = provinceName;
      }
    }
    
    if (queryText) {
      params.set("q", queryText);
    } else {
      // If no query provided, use a broad search term to get recent news
      // Using "news" as a default query term
      params.set("q", "news");
    }
    // Always sort by publishedAt for latest news when using everything endpoint
    params.set("sortBy", filters.sort === "publishedAt" ? "publishedAt" : "relevancy");
    
    // For 'everything' endpoint, enhance query with country name if country is specified
    // This helps get more relevant results for that country
    if (filters.country && queryText) {
      // Map country code to country name for better search results
      const countryNames: Record<string, string> = {
        za: "South Africa",
        ng: "Nigeria",
        ke: "Kenya",
        eg: "Egypt",
        gh: "Ghana",
        gb: "United Kingdom",
        fr: "France",
        de: "Germany",
        it: "Italy",
        es: "Spain",
        us: "United States",
        ca: "Canada",
        br: "Brazil",
        mx: "Mexico",
        ar: "Argentina",
        in: "India",
        jp: "Japan",
        kr: "South Korea",
        sg: "Singapore",
        id: "Indonesia",
        sa: "Saudi Arabia",
        ae: "United Arab Emirates",
        il: "Israel",
        qa: "Qatar",
        au: "Australia",
        nz: "New Zealand",
      };
      
      const countryName = countryNames[filters.country];
      // Only add country name if it's not already in the query
      if (countryName && !queryText.toLowerCase().includes(countryName.toLowerCase())) {
        queryText = `${queryText} ${countryName}`;
        params.set("q", queryText);
      }
      
      // Also set language for better results
      const langMap: Record<string, string> = {
        us: "en",
        gb: "en",
        za: "en",
        ng: "en",
        ke: "en",
        au: "en",
        nz: "en",
        ca: "en",
        fr: "fr",
        de: "de",
        it: "it",
        es: "es",
        br: "pt",
        mx: "es",
        ar: "es",
        in: "en",
        jp: "ja",
        kr: "ko",
        sg: "en",
        id: "id",
        sa: "ar",
        ae: "ar",
        il: "he",
        qa: "ar",
        eg: "ar",
        gh: "en",
      };
      const lang = langMap[filters.country] || "en";
      params.set("language", lang);
    } else if (filters.country && !queryText) {
      // If country is specified but no query, use country name as query
      const countryNames: Record<string, string> = {
        za: "South Africa",
        ng: "Nigeria",
        ke: "Kenya",
        eg: "Egypt",
        gh: "Ghana",
        gb: "United Kingdom",
        fr: "France",
        de: "Germany",
        it: "Italy",
        es: "Spain",
        us: "United States",
        ca: "Canada",
        br: "Brazil",
        mx: "Mexico",
        ar: "Argentina",
        in: "India",
        jp: "Japan",
        kr: "South Korea",
        sg: "Singapore",
        id: "Indonesia",
        sa: "Saudi Arabia",
        ae: "United Arab Emirates",
        il: "Israel",
        qa: "Qatar",
        au: "Australia",
        nz: "New Zealand",
      };
      const countryName = countryNames[filters.country] || "news";
      params.set("q", countryName);
      
      const langMap: Record<string, string> = {
        us: "en",
        gb: "en",
        za: "en",
        ng: "en",
        ke: "en",
        au: "en",
        nz: "en",
        ca: "en",
        fr: "fr",
        de: "de",
        it: "it",
        es: "es",
        br: "pt",
        mx: "es",
        ar: "es",
        in: "en",
        jp: "ja",
        kr: "ko",
        sg: "en",
        id: "id",
        sa: "ar",
        ae: "ar",
        il: "he",
        qa: "ar",
        eg: "ar",
        gh: "en",
      };
      const lang = langMap[filters.country] || "en";
      params.set("language", lang);
    }
    
    // Calculate date range for 'everything' endpoint
    // Default to last 7 days if no time filter specified to ensure we get recent news
    const now = new Date();
    let fromDate = new Date();
    
    if (filters.time) {
      if (filters.time === "24h") {
        fromDate.setHours(now.getHours() - 24);
      } else if (filters.time === "7d") {
        fromDate.setDate(now.getDate() - 7);
      } else if (filters.time === "30d") {
        fromDate.setDate(now.getDate() - 30);
      }
    } else {
      // Default to last 7 days for latest news when no time filter is specified
      fromDate.setDate(now.getDate() - 7);
    }
    
    params.set("from", fromDate.toISOString());
    params.set("to", now.toISOString());
  } else {
    // top-headlines endpoint
    console.log("[Provider] Using top-headlines endpoint with:", {
      category: effectiveCategory,
      country: effectiveCountry,
      query: filters.q
    });
    if (effectiveCategory) {
      params.set("category", effectiveCategory);
    }
    if (effectiveCountry) {
      params.set("country", effectiveCountry);
    }
    if (filters.q) {
      params.set("q", filters.q);
    }
  }
  
  params.set("pageSize", "100"); // Max results per request
  params.set("apiKey", apiKey);
  
  const url = `${NEWS_API_BASE_URL}/${endpoint}?${params.toString()}`;
  console.log("[Provider] Fetching from NewsAPI:", url.replace(apiKey, "***"));
  
  try {
    const response = await fetch(url, {
      next: { revalidate: 300 }, // Cache for 5 minutes
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again later.");
      }
      if (response.status === 401) {
        throw new Error("Invalid API key. Please check your NEWS_API_KEY.");
      }
      throw new Error(`NewsAPI error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (data.status === "error") {
      throw new Error(data.message || "NewsAPI returned an error");
    }
    
    const articles = (data.articles || []).map((article: any) =>
      normalizeArticle(article, "newsapi")
    );
    
    console.log("[Provider] NewsAPI returned", articles.length, "articles");
    
    return articles;
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to fetch news");
  }
}

