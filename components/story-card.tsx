"use client";

import { StoryCluster } from "@/lib/news/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { isBookmarked, saveBookmark, removeBookmark } from "@/lib/storage/bookmarks";
import { guessTags } from "@/lib/utils/tags";

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

  const tags = guessTags(cluster.title, mainArticle.category);

  return (
    <article className="group relative rounded-3xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
      {/* Gradient ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 [background:radial-gradient(900px_circle_at_10%_0%,hsl(var(--brand)/0.18),transparent_35%),radial-gradient(700px_circle_at_90%_100%,hsl(var(--brand2)/0.14),transparent_40%)]" />
      
      <div className="relative flex gap-3">
        {imageUrl && (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={imageUrl}
              alt={cluster.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2 mb-1">
            <span className="rounded-full bg-muted/50 px-2 py-1 text-xs font-medium">
              {cluster.articles.length} {cluster.articles.length === 1 ? "source" : "sources"}
            </span>
            <button
              onClick={handleBookmark}
              className="rounded-full bg-muted/50 px-3 py-1 text-xs hover:bg-muted transition"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            <a
              href={mainArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {cluster.title}
            </a>
          </h3>

          {tags.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted/50 px-2 py-0.5 text-[11px] text-muted-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {mainArticle.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {mainArticle.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted/50 px-2 py-1">{cluster.topSource}</span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          {cluster.articles.length > 1 && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {expanded ? "Show less" : `Show ${cluster.articles.length - 1} more`}
              </button>
            </div>
          )}

          {expanded && cluster.articles.length > 1 && (
            <div className="mt-4 space-y-2 pt-4">
              <p className="text-xs font-medium text-muted-foreground">
                Other sources:
              </p>
              {cluster.articles.slice(1).map((article) => (
                <div key={article.id} className="text-sm">
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium hover:underline"
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

