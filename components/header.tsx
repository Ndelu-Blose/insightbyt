"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { updateQueryParam } from "@/lib/url/query";
import { detectLocationInQuery } from "@/lib/utils/search-detector";
import { setTheme as saveThemeToCookie, getTheme } from "@/lib/preferences/storage";

export function Header() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMounted(true);
    setSearchQuery(searchParams.get("q") || "");
  }, [searchParams]);
  
  // Sync theme from cookie when component mounts
  useEffect(() => {
    const savedTheme = getTheme();
    if (savedTheme && savedTheme !== "system" && theme !== savedTheme) {
      setTheme(savedTheme);
    }
  }, [theme, setTheme]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    // If search query is empty, don't do anything
    if (!searchQuery.trim()) {
      return;
    }
    
    // Detect location in search query
    const detected = detectLocationInQuery(searchQuery);
    
    // Build query params with detected location and remaining query
    let params = new URLSearchParams(searchParams);
    
    // Update query text (remaining after location detection)
    // If only location was detected (no remaining query), keep the original query
    // This allows searching for "South Africa" to still search for "South Africa" news
    if (detected.remainingQuery && detected.remainingQuery.trim()) {
      params.set("q", detected.remainingQuery);
    } else if (detected.country || detected.province) {
      // If location was detected but no remaining query, use original query
      // This handles cases like "South Africa" where we want to search for South Africa news
      params.set("q", searchQuery);
    } else {
      // Normal search query
      params.set("q", searchQuery);
    }
    
    // Update country if detected
    if (detected.country) {
      params.set("country", detected.country);
    }
    
    // Update province if detected
    if (detected.province) {
      params.set("province", detected.province);
      // Ensure country is set if province is detected
      if (!detected.country) {
        // Province detection should include country, but fallback to za for SA provinces
        const saProvinces = ["gauteng", "western-cape", "eastern-cape", "kwazulu-natal", "limpopo", "mpumalanga", "north-west", "northern-cape", "free-state"];
        if (saProvinces.includes(detected.province)) {
          params.set("country", "za");
        }
      }
    }
    
    router.push(`/?${params.toString()}`);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    // Save theme preference to cookie
    saveThemeToCookie(newTheme);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-[0_1px_0_rgba(0,0,0,0.06)]">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center gap-4">
          {/* Logo Block - Tighter */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="h-9 w-9 rounded-xl bg-[radial-gradient(circle_at_30%_20%,hsl(var(--brand)/0.9),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(var(--brand2)/0.85),transparent_55%)] shadow-sm" />
            <div className="leading-tight">
              <div className="text-sm font-semibold">Insight by T</div>
              <div className="text-xs text-muted-foreground/70">Signal over noise</div>
            </div>
          </Link>

          {/* Search Bar - Matches Pill Style */}
          <form onSubmit={handleSearch} className="hidden md:block flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search news…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur border border-black/5 dark:border-white/10 px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--brand)/0.35)] focus:border-black/10 dark:focus:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </form>

          {/* Right Nav - Pill Buttons */}
          <nav className="flex items-center gap-2 ml-auto">
            <Link
              href="/bookmarks"
              className="h-10 px-4 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur border border-black/5 dark:border-white/10 flex items-center text-sm hover:bg-white/10 dark:hover:bg-white/10 transition whitespace-nowrap"
            >
              Bookmarks
            </Link>
            <Link
              href="/about"
              className="h-10 px-4 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur border border-black/5 dark:border-white/10 flex items-center text-sm hover:bg-white/10 dark:hover:bg-white/10 transition whitespace-nowrap"
            >
              About
            </Link>
            <button
              onClick={toggleTheme}
              className="h-10 w-10 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur border border-black/5 dark:border-white/10 grid place-items-center hover:bg-white/10 dark:hover:bg-white/10 transition"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
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
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
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
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              )}
            </button>
          </nav>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden mt-3">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                placeholder="Search news…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 rounded-full bg-white/5 dark:bg-white/5 backdrop-blur border border-black/5 dark:border-white/10 px-4 pr-10 text-sm outline-none focus:ring-2 focus:ring-[hsl(var(--brand)/0.35)] focus:border-black/10 dark:focus:border-white/20 hover:bg-white/10 dark:hover:bg-white/10 transition"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 pointer-events-none">
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </span>
            </div>
          </form>
        </div>
      </div>
    </header>
  );
}
