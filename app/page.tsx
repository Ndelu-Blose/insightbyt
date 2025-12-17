"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Filters } from "@/lib/news/types";
import { getFiltersFromSearchParams } from "@/lib/url/query";
import { FiltersPanel } from "@/components/filters-panel";
import { MobileFiltersDrawer } from "@/components/mobile-filters-drawer";
import { NewsFeed } from "@/components/news-feed";
import { LoadingSkeleton } from "@/components/loading-skeleton";

function HomeContent() {
  const searchParams = useSearchParams();
  const filters = getFiltersFromSearchParams(searchParams);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <FiltersPanel />
        <main className="flex-1 p-6 lg:pl-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">News Feed</h1>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="lg:hidden rounded-md border border-border bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Filters
            </button>
          </div>
          <NewsFeed filters={filters} />
        </main>
      </div>
      <MobileFiltersDrawer
        isOpen={mobileFiltersOpen}
        onClose={() => setMobileFiltersOpen(false)}
      />
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

