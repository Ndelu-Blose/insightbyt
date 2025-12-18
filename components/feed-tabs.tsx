"use client";

type Tab = "now" | "trending" | "for-you";

export function FeedTabs({
  value,
  onChange,
}: {
  value: Tab;
  onChange: (v: Tab) => void;
}) {
  const tabs: { key: Tab; label: string }[] = [
    { key: "now", label: "Now" },
    { key: "trending", label: "Trending" },
    { key: "for-you", label: "For You" },
  ];

  return (
    <div className="mt-4">
      <div className="flex items-center justify-start rounded-full bg-background/55 p-1 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/45 w-fit">
        {tabs.map((t) => {
          const active = value === t.key;
          return (
            <button
              key={t.key}
              type="button"
              onClick={() => onChange(t.key)}
              className={[
                "relative h-10 select-none rounded-full px-3 sm:px-4 text-xs sm:text-sm transition whitespace-nowrap",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--brand)/0.35)] focus-visible:ring-offset-2",
                active
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              ].join(" ")}
            >
              {/* active pill */}
              {active ? (
                <span
                  className="absolute inset-0 -z-10 rounded-full bg-background/80 shadow-sm transition [background:radial-gradient(900px_circle_at_10%_0%,hsl(var(--brand)/0.20),transparent_40%),radial-gradient(700px_circle_at_90%_100%,hsl(var(--brand2)/0.16),transparent_45%)]"
                />
              ) : null}

              {/* tiny indicator dot */}
              <span
                className="mr-1.5 sm:mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle bg-[hsl(var(--brand))] transition-opacity"
                style={{ opacity: active ? 1 : 0 }}
              />

              <span className="align-middle">{t.label}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 text-xs text-muted-foreground hidden sm:block">
        Switch views to change what the feed prioritizes.
      </p>
    </div>
  );
}

