import { hasAnalyticsConsent } from "@/lib/cookies/consent";

/**
 * Track a custom event (only if analytics consent is granted)
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, any>
): void {
  if (typeof window === "undefined") return;
  if (!hasAnalyticsConsent()) return;

  try {
    // Use Vercel Analytics if available
    if (typeof window !== "undefined" && (window as any).va) {
      (window as any).va("track", eventName, properties);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === "development") {
      console.log("[Analytics]", eventName, properties);
    }
  } catch (error) {
    console.error("Failed to track event:", error);
  }
}

/**
 * Track page view
 */
export function trackPageView(path: string): void {
  trackEvent("page_view", { path });
}

/**
 * Track article click
 */
export function trackArticleClick(articleId: string, title: string): void {
  trackEvent("article_click", {
    articleId,
    title: title.substring(0, 100), // Limit length
  });
}

/**
 * Track filter change
 */
export function trackFilterChange(filterType: string, value: string): void {
  trackEvent("filter_change", { filterType, value });
}

/**
 * Track search query (anonymized)
 */
export function trackSearchQuery(queryLength: number, hasFilters: boolean): void {
  trackEvent("search_query", {
    queryLength,
    hasFilters,
    // Don't send actual query for privacy
  });
}

/**
 * Track tab switch
 */
export function trackTabSwitch(tab: string): void {
  trackEvent("tab_switch", { tab });
}

