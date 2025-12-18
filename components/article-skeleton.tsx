export function ArticleSkeleton() {
  return (
    <div className="animate-pulse rounded-3xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
      <div className="flex gap-3">
        <div className="h-20 w-28 shrink-0 rounded-xl bg-muted" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-4/5 rounded bg-muted" />
          <div className="h-4 w-3/5 rounded bg-muted" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-24 rounded-full bg-muted" />
            <div className="h-6 w-16 rounded-full bg-muted" />
          </div>
        </div>
      </div>
    </div>
  );
}

