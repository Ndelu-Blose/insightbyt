"use client";

import { Article } from "@/lib/news/types";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useState, useEffect } from "react";
import { isBookmarked, saveBookmark, removeBookmark } from "@/lib/storage/bookmarks";
import { guessTags } from "@/lib/utils/tags";

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps) {
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

  const tags = guessTags(article.title, article.category);

  return (
    <article className="group relative rounded-3xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)] transition-all hover:-translate-y-0.5 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_50px_rgba(0,0,0,0.45)]">
      {/* Gradient ring on hover */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition group-hover:opacity-100 [background:radial-gradient(900px_circle_at_10%_0%,hsl(var(--brand)/0.18),transparent_35%),radial-gradient(700px_circle_at_90%_100%,hsl(var(--brand2)/0.14),transparent_40%)]" />
      
      <div className="relative flex gap-3">
        {article.imageUrl && (
          <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-muted">
            <Image
              src={article.imageUrl}
              alt={article.title}
              fill
              className="object-cover group-hover:scale-[1.03] transition"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug">
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {article.title}
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

          {article.description && (
            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
              {article.description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="rounded-full bg-muted/50 px-2 py-1">{article.source}</span>
            <span>•</span>
            <span>{timeAgo}</span>
            {article.country && (
              <>
                <span>•</span>
                <span className="uppercase">{article.country}</span>
              </>
            )}

            <button
              onClick={handleBookmark}
              className="ml-auto rounded-full bg-muted/50 px-3 py-1 hover:bg-muted transition"
              aria-label={bookmarked ? "Remove bookmark" : "Add bookmark"}
            >
              {bookmarked ? "Saved" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

