"use client";

import { useEffect, useState } from "react";
import { Article, StoryCluster } from "@/lib/news/types";
import { getBookmarks, removeBookmark, getCollections } from "@/lib/storage/bookmarks";
import { ArticleCard } from "@/components/article-card";
import { StoryCard } from "@/components/story-card";

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Array<Article | StoryCluster>>([]);
  const [collections, setCollections] = useState<string[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<string>("");

  useEffect(() => {
    const loadBookmarks = () => {
      const cols = getCollections();
      setCollections(cols);
      
      if (cols.length > 0) {
        const collection = selectedCollection || cols[0];
        setSelectedCollection(collection);
        const items = getBookmarks(collection);
        setBookmarks(items);
      } else {
        setBookmarks([]);
      }
    };

    loadBookmarks();
    
    // Listen for storage changes (in case bookmarks are updated in another tab)
    window.addEventListener("storage", loadBookmarks);
    return () => window.removeEventListener("storage", loadBookmarks);
  }, [selectedCollection]);

  const handleRemove = (id: string) => {
    removeBookmark(id);
    const items = getBookmarks(selectedCollection);
    setBookmarks(items);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <h1 className="mb-8 text-3xl font-bold">Bookmarks</h1>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg
            className="mb-4 h-16 w-16 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
          <h3 className="mb-2 text-lg font-semibold">No bookmarks yet</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Start bookmarking articles to save them for later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Bookmarks</h1>
        {collections.length > 1 && (
          <select
            value={selectedCollection}
            onChange={(e) => setSelectedCollection(e.target.value)}
            className="rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            {collections.map((col) => (
              <option key={col} value={col}>
                {col}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="space-y-4">
        {bookmarks.map((item) => {
          if ("articles" in item) {
            return <StoryCard key={item.id} cluster={item as StoryCluster} />;
          } else {
            return <ArticleCard key={item.id} article={item as Article} />;
          }
        })}
      </div>
    </div>
  );
}

