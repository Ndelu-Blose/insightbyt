"use client";

import { StoryCluster } from "@/lib/news/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { isBookmarked, saveBookmark, removeBookmark } from "@/lib/storage/bookmarks";

interface StoryCardProps {
  cluster: StoryCluster;
}

export function StoryCard({ cluster }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(cluster.id));
  }, [cluster.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(cluster.id);
      setBookmarked(false);
    } else {
      saveBookmark(cluster);
      setBookmarked(true);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(cluster.publishedAt), {
    addSuffix: true,
  });

  const mainArticle = cluster.articles[0];
  const imageUrl = mainArticle.imageUrl;

  return (
    <article className="group rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex gap-4">
        {imageUrl && (
          <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md">
            <Image
              src={imageUrl}
              alt={cluster.title}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  {cluster.articles.length} {cluster.articles.length === 1 ? "source" : "sources"}
                </span>
              </div>
              <h3 className="text-lg font-semibold leading-tight group-hover:text-primary">
                <a
                  href={mainArticle.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {cluster.title}
                </a>
              </h3>
            </div>
            <button
              onClick={handleBookmark}
              className="flex-shrink-0 rounded-md p-1 hover:bg-muted"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? (
                <svg
                  className="h-5 w-5 fill-yellow-500 text-yellow-500"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ) : (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              )}
            </button>
          </div>

          {mainArticle.description && (
            <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
              {mainArticle.description}
            </p>
          )}

          <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="font-medium">{cluster.topSource}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <a
              href={mainArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-primary hover:underline"
            >
              Read article →
            </a>
            {cluster.articles.length > 1 && (
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                {expanded ? "Show less" : `Show ${cluster.articles.length - 1} more`}
              </button>
            )}
          </div>

          {expanded && cluster.articles.length > 1 && (
            <div className="mt-4 space-y-2 border-t pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Other sources:
              </p>
              {cluster.articles.slice(1).map((article) => (
                <div key={article.id} className="text-sm">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:text-primary hover:underline"
                  >
                    {article.title}
                  </a>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {article.source}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

