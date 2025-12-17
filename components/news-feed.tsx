"use client";

import { useEffect, useState } from "react";
import { Filters, NewsResponse, Article, StoryCluster } from "@/lib/news/types";
import { ArticleCard } from "./article-card";
import { StoryCard } from "./story-card";
import { LoadingSkeleton } from "./loading-skeleton";
import { EmptyState } from "./empty-state";

interface NewsFeedProps {
  filters: Filters;
}

export function NewsFeed({ filters }: NewsFeedProps) {
  const [data, setData] = useState<NewsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);

      try {
        const queryParams = new URLSearchParams();
        if (filters.q) queryParams.set("q", filters.q);
        if (filters.category) queryParams.set("category", filters.category);
        if (filters.country) queryParams.set("country", filters.country);
        if (filters.region) queryParams.set("region", filters.region);
        if (filters.time) queryParams.set("time", filters.time);
        if (filters.sort) queryParams.set("sort", filters.sort);

        const response = await fetch(`/api/news?${queryParams.toString()}`);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(
            errorData.error || `Failed to fetch news: ${response.statusText}`
          );
        }

        const result: NewsResponse = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [filters]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error) {
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

  return (
    <div className="space-y-4">
      {data.items.map((item) => {
        if ("articles" in item) {
          return <StoryCard key={item.id} cluster={item as StoryCluster} />;
        } else {
          return <ArticleCard key={item.id} article={item as Article} />;
        }
      })}
    </div>
  );
}

