"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getFiltersFromSearchParams } from "@/lib/url/query";
import { FiltersBar } from "@/components/filters-bar";
import { NewsFeed } from "@/components/news-feed";
import { FeedTabs } from "@/components/feed-tabs";
import { LoadingSkeleton } from "@/components/loading-skeleton";
import { getDefaultTab, setDefaultTab } from "@/lib/preferences/storage";
import { trackTabSwitch } from "@/lib/analytics/tracker";

type Tab = "now" | "trending" | "for-you";

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const filters = getFiltersFromSearchParams(searchParams);
  console.log("[HomeContent] Current filters from URL:", filters);
  
  // Get tab from URL, cookie preference, or default to "now"
  const tabFromUrl = searchParams.get("view") as Tab | null;
  const tabFromCookie = getDefaultTab();
  const initialTab = tabFromUrl && ["now", "trending", "for-you"].includes(tabFromUrl)
    ? tabFromUrl
    : tabFromCookie || "now";
  
  const [tab, setTab] = useState<Tab>(initialTab);

  // Sync URL to tab when URL changes (but not when we change tab)
  useEffect(() => {
    const urlTab = searchParams.get("view") as Tab | null;
    if (urlTab && ["now", "trending", "for-you"].includes(urlTab) && urlTab !== tab) {
      setTab(urlTab);
    } else if (!urlTab) {
      // URL has no view param - use cookie preference or default
      const cookieTab = getDefaultTab();
      if (cookieTab && cookieTab !== tab) {
        setTab(cookieTab);
      } else if (!cookieTab && tab !== "now") {
        setTab("now");
      }
    }
  }, [searchParams, tab]);

  // Handle tab change - sync to URL and save to cookie
  const handleTabChange = (newTab: Tab) => {
    setTab(newTab);
    // Save to cookie preference
    setDefaultTab(newTab);
    // Track analytics event
    trackTabSwitch(newTab);
    
    const params = new URLSearchParams(searchParams);
    if (newTab === "now") {
      params.delete("view");
    } else {
      params.set("view", newTab);
    }
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  return (
    <>
      <FiltersBar />
      <main className="mx-auto max-w-6xl px-4 py-6">
        <div className="mb-5 space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">News Feed</h1>
          <p className="text-sm text-muted-foreground">Filter-first news. Signal over noise.</p>
          <FeedTabs value={tab} onChange={handleTabChange} />
        </div>
        <NewsFeed filters={filters} tab={tab} />
      </main>
    </>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

