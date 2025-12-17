import { NextRequest, NextResponse } from "next/server";
import { Filters, NewsResponse } from "@/lib/news/types";
import { getCountriesForRegion } from "@/lib/news/region-map";
import { fetchNews } from "@/lib/news/provider";
import { clusterArticles } from "@/lib/news/cluster";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract filters from query params
    const filters: Filters = {
      q: searchParams.get("q") || undefined,
      category: searchParams.get("category") || undefined,
      country: searchParams.get("country") || undefined,
      region: searchParams.get("region") || undefined,
      time: (searchParams.get("time") as "24h" | "7d" | "30d") || undefined,
      sort:
        (searchParams.get("sort") as "publishedAt" | "relevancy") ||
        "publishedAt",
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
      // Fetch for each country and merge
      const fetchPromises = countriesToFetch.map((country) =>
        fetchNews({ ...filters, country })
      );
      
      const results = await Promise.allSettled(fetchPromises);
      
      for (const result of results) {
        if (result.status === "fulfilled") {
          allArticles.push(...result.value);
        } else {
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
    if (filters.sort === "relevancy") {
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
    
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching news:", error);
    
    if (error instanceof Error) {
      if (error.message.includes("Rate limit")) {
        return NextResponse.json(
          { error: error.message },
          { status: 429 }
        );
      }
      if (error.message.includes("API key")) {
        return NextResponse.json(
          { error: error.message },
          { status: 401 }
        );
      }
      return NextResponse.json(
        { error: error.message || "Failed to fetch news" },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

