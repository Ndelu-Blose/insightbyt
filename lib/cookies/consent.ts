import { getCookie, setCookie, COOKIE_CONSENT } from "./preferences";

export type ConsentLevel = "accepted" | "rejected" | "custom";

export interface ConsentPreferences {
  essential: boolean; // Always true
  analytics: boolean;
}

/**
 * Get current consent level
 */
export function getConsent(): ConsentLevel | null {
  const consent = getCookie(COOKIE_CONSENT);
  if (!consent) return null;

  if (consent === "accepted" || consent === "rejected" || consent === "custom") {
    return consent;
  }

  return null;
}

/**
 * Get detailed consent preferences
 */
export function getConsentPreferences(): ConsentPreferences | null {
  const consent = getConsent();
  if (!consent) return null;

  if (consent === "accepted") {
    return { essential: true, analytics: true };
  }

  if (consent === "rejected") {
    return { essential: true, analytics: false };
  }

  // For "custom", we need to parse the preferences from a separate cookie
  const prefsCookie = getCookie(`${COOKIE_CONSENT}-prefs`);
  if (prefsCookie) {
    try {
      const prefs = JSON.parse(prefsCookie);
      return {
        essential: true, // Always true
        analytics: prefs.analytics === true,
      };
    } catch {
      return { essential: true, analytics: false };
    }
  }

  return { essential: true, analytics: false };
}

/**
 * Set consent level and preferences
 */
export function setConsent(
  level: ConsentLevel,
  preferences?: ConsentPreferences
): void {
  setCookie(COOKIE_CONSENT, level);

  if (level === "custom" && preferences) {
    // Store detailed preferences for custom consent
    try {
      const prefsJson = JSON.stringify({
        analytics: preferences.analytics === true,
      });
      setCookie(`${COOKIE_CONSENT}-prefs`, prefsJson);
    } catch (error) {
      console.error("Failed to save consent preferences:", error);
    }
  }
}

/**
 * Check if user has given any consent
 */
export function hasConsent(): boolean {
  return getConsent() !== null;
}

/**
 * Check if user has consented to analytics
 */
export function hasAnalyticsConsent(): boolean {
  const prefs = getConsentPreferences();
  return prefs?.analytics === true;
}

