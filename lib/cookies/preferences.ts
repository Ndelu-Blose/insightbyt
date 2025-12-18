import Cookies from "js-cookie";

export const COOKIE_CONSENT = "insight-consent";
export const COOKIE_PREFS = "insight-prefs";

export interface CookieOptions {
  expires?: number;
  sameSite?: "strict" | "lax" | "none";
  secure?: boolean;
  path?: string;
}

export const COOKIE_OPTIONS: CookieOptions = {
  expires: 365, // 1 year
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

/**
 * Get a cookie value by name
 */
export function getCookie(name: string): string | null {
  if (typeof window === "undefined") return null;
  return Cookies.get(name) || null;
}

/**
 * Set a cookie with options
 */
export function setCookie(
  name: string,
  value: string,
  options?: Partial<CookieOptions>
): void {
  if (typeof window === "undefined") return;
  Cookies.set(name, value, { ...COOKIE_OPTIONS, ...options });
}

/**
 * Delete a cookie
 */
export function deleteCookie(name: string, path: string = "/"): void {
  if (typeof window === "undefined") return;
  Cookies.remove(name, { path });
}

/**
 * Get user preferences from cookie
 */
export function getPreferences(): Record<string, any> | null {
  const prefsCookie = getCookie(COOKIE_PREFS);
  if (!prefsCookie) return null;

  try {
    return JSON.parse(prefsCookie);
  } catch {
    return null;
  }
}

/**
 * Set user preferences in cookie
 */
export function setPreferences(prefs: Record<string, any>): void {
  try {
    const json = JSON.stringify(prefs);
    setCookie(COOKIE_PREFS, json);
  } catch (error) {
    console.error("Failed to save preferences:", error);
  }
}

