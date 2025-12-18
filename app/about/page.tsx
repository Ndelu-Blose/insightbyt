"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Hero Section with Gradient Background */}
      <div className="relative mb-16 overflow-hidden rounded-3xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10),0_20px_80px_rgba(0,0,0,0.45)] p-12 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--brand)/0.08),transparent_50%),radial-gradient(circle_at_70%_70%,hsl(var(--brand2)/0.06),transparent_50%)]" />
        <div className="relative">
          <div className="mb-6 inline-flex h-24 w-24 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_30%_20%,hsl(var(--brand)/0.9),transparent_60%),radial-gradient(circle_at_70%_70%,hsl(var(--brand2)/0.85),transparent_55%)] shadow-lg transition-transform hover:scale-105">
            <svg
              className="h-12 w-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
          <h1 className="mb-4 text-6xl font-semibold tracking-tight">About Insight by T</h1>
          <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
            Filter-first news intelligence designed to help you find signal over noise
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
        <div className="rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-background/80 dark:hover:bg-white/7 hover:-translate-y-0.5 transition p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-[hsl(var(--brand))]">
            {mounted ? "50+" : "0"}
          </div>
          <div className="text-sm text-muted-foreground">Countries</div>
        </div>
        <div className="rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-background/80 dark:hover:bg-white/7 hover:-translate-y-0.5 transition p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-[hsl(var(--brand2))]">
            {mounted ? "9" : "0"}
          </div>
          <div className="text-sm text-muted-foreground">Provinces (SA)</div>
        </div>
        <div className="rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-background/80 dark:hover:bg-white/7 hover:-translate-y-0.5 transition p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-[hsl(var(--brand))]">
            {mounted ? "1000+" : "0"}
          </div>
          <div className="text-sm text-muted-foreground">News Sources</div>
        </div>
        <div className="rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] hover:bg-background/80 dark:hover:bg-white/7 hover:-translate-y-0.5 transition p-6 text-center">
          <div className="mb-2 text-3xl font-bold text-[hsl(var(--brand2))]">
            {mounted ? "7" : "0"}
          </div>
          <div className="text-sm text-muted-foreground">Categories</div>
        </div>
      </div>

      {/* What is Section */}
      <div className="mb-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-10">
        <h2 className="mb-6 text-3xl font-semibold">What is Insight by T?</h2>
        <p className="mb-4 text-lg text-muted-foreground leading-relaxed">
          Insight by T is a filter-first news intelligence website designed to help
          you find signal over noise. We aggregate news from multiple sources and
          provide powerful filtering tools to help you discover the stories that
          matter most to you.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Unlike traditional news aggregators, we put filters front and center—making
          it effortless to drill down into exactly what you want to read, when you want
          to read it.
        </p>
      </div>

      {/* Key Features Grid */}
      <div className="mb-12">
        <div className="mb-8 text-center">
          <h2 className="mb-2 text-3xl font-semibold">Key Features</h2>
          <p className="text-muted-foreground">Everything you need to stay informed</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8 transition-all hover:-translate-y-1 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(var(--brand)/0.05)] blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--brand)/0.1)] transition-transform group-hover:scale-110">
                <svg
                  className="h-7 w-7 text-[hsl(var(--brand))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Filter-First UI</h3>
            </div>
            <p className="relative text-muted-foreground leading-relaxed">
              Filters are always visible and accessible, making it easy to refine your news feed on the fly. No digging through menus—everything is right where you need it.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8 transition-all hover:-translate-y-1 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(var(--brand2)/0.05)] blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--brand2)/0.1)] transition-transform group-hover:scale-110">
                <svg
                  className="h-7 w-7 text-[hsl(var(--brand2))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Region-Aware News</h3>
            </div>
            <p className="relative text-muted-foreground leading-relaxed">
              Filter by region, country, or province to get news relevant to your location. Perfect for local insights and staying connected to what matters in your area.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8 transition-all hover:-translate-y-1 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(var(--brand)/0.05)] blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--brand)/0.1)] transition-transform group-hover:scale-110">
                <svg
                  className="h-7 w-7 text-[hsl(var(--brand))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Story Clustering</h3>
            </div>
            <p className="relative text-muted-foreground leading-relaxed">
              Similar headlines are automatically grouped together to reduce duplicate stories and show you the full picture from multiple sources in one place.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8 transition-all hover:-translate-y-1 hover:bg-background/80 dark:hover:bg-white/7 hover:border-border/30 dark:hover:border-white/15 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] dark:hover:shadow-[0_15px_40px_rgba(0,0,0,0.45)]">
            <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-[hsl(var(--brand2)/0.05)] blur-2xl transition-transform group-hover:scale-150" />
            <div className="relative mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[hsl(var(--brand2)/0.1)] transition-transform group-hover:scale-110">
                <svg
                  className="h-7 w-7 text-[hsl(var(--brand2))]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold">Shareable Views</h3>
            </div>
            <p className="relative text-muted-foreground leading-relaxed">
              All filters are stored in the URL, so you can share your filtered view with others instantly. Bookmark your favorite combinations for quick access.
            </p>
          </div>

          <div className="group relative overflow-hidden rounded-xl border border-border/70 bg-background/70 p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg md:col-span-2">
            <div className="absolute right-0 top-0 h-40 w-40 translate-x-12 -translate-y-12 rounded-full bg-gradient-to-br from-[hsl(var(--brand)/0.08)] to-[hsl(var(--brand2)/0.08)] blur-3xl transition-transform group-hover:scale-150" />
            <div className="relative mb-4 flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-[hsl(var(--brand)/0.1)] to-[hsl(var(--brand2)/0.1)] transition-transform group-hover:scale-110">
                <svg
                  className="h-7 w-7 text-[hsl(var(--brand))]"
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
              </div>
              <h3 className="text-xl font-semibold">Smart Bookmarks</h3>
            </div>
            <p className="relative text-muted-foreground leading-relaxed">
              Save articles for later reading and organize them into collections. All stored locally in your browser for complete privacy—your data never leaves your device.
            </p>
          </div>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="mb-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-10">
        <h2 className="mb-6 text-3xl font-semibold">Built With Modern Technology</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 rounded-lg bg-background/50 dark:bg-white/5 border border-border/20 dark:border-white/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white font-bold">
              N
            </div>
            <div>
              <div className="font-semibold">Next.js</div>
              <div className="text-xs text-muted-foreground">App Router</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background/50 dark:bg-white/5 border border-border/20 dark:border-white/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500 text-white font-bold">
              T
            </div>
            <div>
              <div className="font-semibold">Tailwind CSS</div>
              <div className="text-xs text-muted-foreground">Styling</div>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-background/50 dark:bg-white/5 border border-border/20 dark:border-white/10 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600 text-white font-bold">
              TS
            </div>
            <div>
              <div className="font-semibold">TypeScript</div>
              <div className="text-xs text-muted-foreground">Type Safety</div>
            </div>
          </div>
        </div>
      </div>

      {/* Data Sources */}
      <div className="mb-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-10">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--brand)/0.1)]">
            <svg
              className="h-6 w-6 text-[hsl(var(--brand))]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-semibold">Data Sources</h2>
        </div>
        <p className="mb-4 text-lg text-muted-foreground leading-relaxed">
          Insight by T uses{" "}
          <a
            href="https://newsapi.org"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-[hsl(var(--brand))] hover:underline"
          >
            NewsAPI.org
          </a>{" "}
          to aggregate news articles from thousands of sources worldwide. NewsAPI
          provides access to breaking news headlines and articles from news sources
          and blogs across the globe, ensuring you get comprehensive coverage of the
          stories that matter.
        </p>
      </div>

      {/* Disclaimer & Privacy Side by Side */}
      <div className="mb-12 grid gap-6 md:grid-cols-2">
        <div className="rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
              <svg
                className="h-6 w-6 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Disclaimer</h2>
          </div>
          <p className="mb-3 text-sm text-muted-foreground leading-relaxed">
            Insight by T is an aggregator and does not produce original news content.
            We do not verify the accuracy of articles or endorse any particular source
            or viewpoint.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            News content is provided &quot;as is&quot; without warranty of any kind. All articles
            link back to their original sources for verification.
          </p>
        </div>

        <div className="rounded-xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold">Privacy First</h2>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Insight by T stores bookmarks locally in your browser using LocalStorage.
            No personal data is collected or transmitted to external servers. Your
            browsing history and preferences remain completely private—we don&apos;t track
            you, period.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="mb-12 rounded-2xl bg-background/70 dark:bg-white/5 border border-border/20 dark:border-white/10 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] dark:shadow-[0_10px_30px_rgba(0,0,0,0.35)] p-10 text-center">
        <h2 className="mb-4 text-3xl font-semibold">Ready to Get Started?</h2>
        <p className="mb-6 text-muted-foreground">
          Start filtering news your way and discover stories that matter to you.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xl bg-[hsl(var(--brand))] px-6 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-105 hover:shadow-lg"
        >
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
          Explore News Feed
        </Link>
      </div>

      {/* Links */}
      <div className="rounded-xl border border-border/70 bg-background/70 p-8 shadow-sm">
        <h2 className="mb-6 text-2xl font-semibold">Resources</h2>
        <div className="flex flex-wrap gap-4">
          <a
            href="https://newsapi.org/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-background/50 dark:bg-white/5 border border-border/20 dark:border-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-background/70 dark:hover:bg-white/10"
          >
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
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            NewsAPI Terms of Service
          </a>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-background/50 dark:bg-white/5 border border-border/20 dark:border-white/10 px-5 py-2.5 text-sm font-medium transition hover:bg-background/70 dark:hover:bg-white/10"
          >
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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
