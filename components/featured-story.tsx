"use client";

import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { useState, useEffect } from "react";
import { isBookmarked, saveBookmark, removeBookmark } from "@/lib/storage/bookmarks";
import { Article } from "@/lib/news/types";

interface FeaturedStoryProps {
  article: Article;
}

export function FeaturedStory({ article }: FeaturedStoryProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setBookmarked(isBookmarked(article.id));
  }, [article.id]);

  const handleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (bookmarked) {
      removeBookmark(article.id);
      setBookmarked(false);
    } else {
      saveBookmark(article);
      setBookmarked(true);
    }
  };

  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  return (
    <section className="relative overflow-hidden rounded-3xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
      {/* soft glow */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-[hsl(var(--brand)/0.18)] blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-[hsl(var(--brand2)/0.16)] blur-3xl" />

      <div className="grid gap-4 p-4 md:grid-cols-[1.2fr_0.8fr] md:p-6">
        <div className="flex flex-col justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-muted/50 px-3 py-1 text-xs text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-[hsl(var(--brand))]" />
              Featured
              <span className="opacity-70">•</span>
              <span>{article.source}</span>
              <span className="opacity-70">•</span>
              <span>{timeAgo}</span>
            </div>

            <h2 className="text-xl font-semibold tracking-tight md:text-2xl">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {article.title}
              </a>
            </h2>

            {article.description && (
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground md:text-base">
                {article.description}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 rounded-full bg-foreground px-4 text-sm font-medium text-background hover:opacity-90 transition inline-flex items-center"
            >
              Read now →
            </a>
            <button
              onClick={handleBookmark}
              className="h-10 rounded-full bg-muted/50 px-4 text-sm hover:bg-muted transition"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>
        </div>

        <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted">
          {article.imageUrl && (
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover"
              priority
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>
      </div>
    </section>
  );
}

