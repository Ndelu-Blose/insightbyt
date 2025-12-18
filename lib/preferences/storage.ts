import {
  getPreferences as getCookiePreferences,
  setPreferences as setCookiePreferences,
} from "@/lib/cookies/preferences";
import { Filters } from "@/lib/news/types";

export interface UserPreferences {
  theme: "light" | "dark" | "system";
  defaultTab: "now" | "trending" | "for-you";
  defaultFilters?: Partial<Filters>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: "system",
  defaultTab: "now",
};

/**
 * Get all user preferences
 */
export function getPreferences(): UserPreferences {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  const cookiePrefs = getCookiePreferences();
  if (!cookiePrefs) {
    // Fallback to localStorage if cookies not available
    try {
      const stored = localStorage.getItem("insight-preferences");
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...DEFAULT_PREFERENCES, ...parsed };
      }
    } catch {
      // Ignore localStorage errors
    }
    return DEFAULT_PREFERENCES;
  }

  return { ...DEFAULT_PREFERENCES, ...cookiePrefs };
}

/**
 * Set user preferences (partial update)
 */
export function setPreferences(prefs: Partial<UserPreferences>): void {
  if (typeof window === "undefined") return;

  const current = getPreferences();
  const updated = { ...current, ...prefs };

  try {
    // Save to cookies
    setCookiePreferences(updated);
    // Also save to localStorage as fallback
    localStorage.setItem("insight-preferences", JSON.stringify(updated));
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

/**
 * Get theme preference
 */
export function getTheme(): UserPreferences["theme"] {
  return getPreferences().theme;
}

/**
 * Set theme preference
 */
export function setTheme(theme: UserPreferences["theme"]): void {
  setPreferences({ theme });
}

/**
 * Get default tab preference
 */
export function getDefaultTab(): UserPreferences["defaultTab"] {
  return getPreferences().defaultTab;
}

/**
 * Set default tab preference
 */
export function setDefaultTab(tab: UserPreferences["defaultTab"]): void {
  setPreferences({ defaultTab: tab });
}

/**
 * Get default filters preference
 */
export function getDefaultFilters(): Partial<Filters> | undefined {
  return getPreferences().defaultFilters;
}

/**
 * Set default filters preference
 */
export function setDefaultFilters(filters: Partial<Filters> | undefined): void {
  setPreferences({ defaultFilters: filters });
}

