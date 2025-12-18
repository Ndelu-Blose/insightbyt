"use client";

import { useEffect, useState, useMemo } from "react";
import { Filters, NewsResponse, Article, StoryCluster } from "@/lib/news/types";
import { ArticleCard } from "./article-card";
import { StoryCard } from "./story-card";
import { FeaturedStory } from "./featured-story";
import { ArticleSkeleton } from "./article-skeleton";
import { EmptyState } from "./empty-state";

type Tab = "now" | "trending" | "for-you";

interface NewsFeedProps {
  filters: Filters;
  tab: Tab;
}

/**
 * Apply tab logic to sort/filter articles
 */
function applyTab(
  items: Array<Article | StoryCluster>,
  tab: Tab
): Array<Article | StoryCluster> {
  if (tab === "now") {
    return items; // Default order (already sorted by API)
  }

  if (tab === "trending") {
    // Sort by most recent (newest first)
    return [...items].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      return dateB - dateA;
    });
  }

  // "for-you": Prioritize clusters (they're more relevant) and recent articles
  return [...items].sort((a, b) => {
    const aIsCluster = "articles" in a;
    const bIsCluster = "articles" in b;
    
    // Clusters first
    if (aIsCluster && !bIsCluster) return -1;
    if (!aIsCluster && bIsCluster) return 1;
    
    // Then by recency
    const dateA = new Date(a.publishedAt).getTime();
    const dateB = new Date(b.publishedAt).getTime();
    return dateB - dateA;
  });
}

export function NewsFeed({ filters, tab }: NewsFeedProps) {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Apply tab logic to items (handle null/undefined data safely)
  const sortedItems = useMemo(() => {
    if (!data || !data.items) return [];
    return applyTab(data.items, tab);
  }, [data, tab]);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("[NewsFeed] Starting fetch with filters:", filters);
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.set("q", filters.q);
        if (filters.category) queryParams.set("category", filters.category);
        if (filters.country) queryParams.set("country", filters.country);
        if (filters.region) queryParams.set("region", filters.region);
        if (filters.province) queryParams.set("province", filters.province);
        if (filters.time) queryParams.set("time", filters.time);
        if (filters.sort) queryParams.set("sort", filters.sort);

        const apiUrl = `/api/news?${queryParams.toString()}`;
        console.log("[NewsFeed] Fetching from API:", apiUrl);
        // Add cache-busting timestamp to prevent stale results
        const cacheBuster = `&_t=${Date.now()}`;
        const response = await fetch(`${apiUrl}${cacheBuster}`, {
          cache: 'no-store', // Disable caching to ensure fresh results
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error("[NewsFeed] API error:", response.status, errorData);
          throw new Error(
            errorData.error || `Failed to fetch news: ${response.statusText}`
          );
        }

        const result: NewsResponse = await response.json();
        console.log("[NewsFeed] API response - Total:", result.total, "Items:", result.items?.length);
        console.log("[NewsFeed] API response - Filters:", JSON.stringify(result.filters));
        if (result.items && result.items.length > 0) {
          console.log("[NewsFeed] First item:", result.items[0]);
        } else {
          console.warn("[NewsFeed] No items in response!");
        }
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    // Depend on individual filter values to ensure re-fetch when any filter changes
  }, [
    filters.q,
    filters.category,
    filters.country,
    filters.region,
    filters.province,
    filters.time,
    filters.sort,
  ]);

  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/0652de7c-3cc6-4d4a-8b23-f556c28f714d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'news-feed.tsx:95',message:'Before conditional returns',data:{loading,hasError:!!error,hasData:!!data,willReturnEarly:loading||!!error||!data},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  // #endregion

  if (loading) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0652de7c-3cc6-4d4a-8b23-f556c28f714d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'news-feed.tsx:96',message:'Early return - loading',data:{hookCountBeforeReturn:3},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return (
      <div className="grid gap-3 md:grid-cols-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <ArticleSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/0652de7c-3cc6-4d4a-8b23-f556c28f714d',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'news-feed.tsx:107',message:'Early return - error',data:{hookCountBeforeReturn:3},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg
          className="mb-4 h-16 w-16 text-destructive"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mb-2 text-lg font-semibold">Error loading news</h3>
        <p className="mb-4 text-sm text-muted-foreground">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return <EmptyState />;
  }

  // Separate featured story (first article) from the rest
  const featuredItem = sortedItems.find((item) => !("articles" in item)) as Article | undefined;
  const remainingItems = featuredItem
    ? sortedItems.filter((item) => item.id !== featuredItem.id)
    : sortedItems;

  return (
    <>
      {/* Featured Story */}
      {featuredItem && (
        <div className="mb-6">
          <FeaturedStory article={featuredItem} />
        </div>
      )}

      {/* Regular Feed Grid */}
      <div className="grid gap-3 md:grid-cols-2">
        {remainingItems.map((item) => {
          if ("articles" in item) {
            return <StoryCard key={item.id} cluster={item as StoryCluster} />;
          } else {
            return <ArticleCard key={item.id} article={item as Article} />;
          }
        })}
      </div>
    </>
  );
}

