"use client";

import { useState, useEffect } from "react";
import { hasConsent, setConsent, getConsentPreferences } from "@/lib/cookies/consent";
import type { ConsentPreferences } from "@/lib/cookies/consent";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [show, setShow] = useState(false);
  const [preferences, setPreferences] = useState<ConsentPreferences>({
    essential: true,
    analytics: false,
  });

  useEffect(() => {
    setMounted(true);
    // Only show banner if consent hasn't been given
    if (!hasConsent()) {
      setShow(true);
      // Load existing preferences if any (for customize mode)
      const existing = getConsentPreferences();
      if (existing && existing.analytics !== undefined) {
        setPreferences(existing);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    setConsent("accepted", { essential: true, analytics: true });
    setShow(false);
  };

  const handleRejectAll = () => {
    setConsent("rejected", { essential: true, analytics: false });
    setShow(false);
  };

  const handleCustomize = () => {
    setExpanded(!expanded);
  };

  const handleSaveCustom = () => {
    setConsent("custom", preferences);
    setShow(false);
  };

  const toggleAnalytics = () => {
    setPreferences((prev) => ({ ...prev, analytics: !prev.analytics }));
  };

  if (!mounted || !show) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-300 ease-out ${
        show ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      } bottom-0 right-0 left-0 md:bottom-4 md:right-4 md:left-auto md:w-[420px]`}
    >
      <div className="border-t md:border border-border/60 bg-background/90 backdrop-blur-xl shadow-lg md:rounded-2xl">
        <div className="p-4 md:p-5">
          {!expanded ? (
            <>
              <div className="mb-3">
                <h3 className="text-sm font-semibold mb-1">We use cookies</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  We use cookies to keep you signed in, remember your preferences, and understand how our site is used. We do not sell your personal data.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={handleRejectAll}
                  className="h-9 rounded-full border border-border/70 bg-background px-4 text-sm hover:bg-muted transition whitespace-nowrap"
                >
                  Reject All
                </button>
                <button
                  onClick={handleCustomize}
                  className="h-9 rounded-full border border-border/70 bg-background px-4 text-sm hover:bg-muted transition whitespace-nowrap"
                >
                  Customize
                </button>
                <button
                  onClick={handleAcceptAll}
                  className="h-9 rounded-full bg-foreground px-4 text-sm text-background hover:opacity-90 transition whitespace-nowrap font-medium"
                >
                  Accept All
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-sm font-semibold mb-2">Cookie Preferences</h3>
                <p className="text-xs text-muted-foreground mb-4">
                  Choose which cookies you want to accept.
                </p>

                <div className="space-y-3">
                  {/* Essential Cookies */}
                  <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background/50">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Essential Cookies</div>
                      <div className="text-xs text-muted-foreground">
                        Required for the site to function. These cannot be disabled.
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="h-5 w-9 rounded-full bg-[hsl(var(--brand))] opacity-60 flex items-center justify-end px-1">
                        <div className="h-3 w-3 rounded-full bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border/60 bg-background/50">
                    <div className="flex-1">
                      <div className="text-sm font-medium mb-1">Analytics Cookies</div>
                      <div className="text-xs text-muted-foreground">
                        Help us understand how visitors interact with our site. All data is anonymized.
                      </div>
                    </div>
                    <button
                      onClick={toggleAnalytics}
                      className={`h-5 w-9 rounded-full transition-colors flex items-center px-1 ${
                        preferences.analytics
                          ? "bg-[hsl(var(--brand))] justify-end"
                          : "bg-muted justify-start"
                      }`}
                      aria-label="Toggle analytics cookies"
                    >
                      <div className="h-3 w-3 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => setExpanded(false)}
                  className="h-9 rounded-full border border-border/70 bg-background px-4 text-sm hover:bg-muted transition whitespace-nowrap"
                >
                  Back
                </button>
                <button
                  onClick={handleSaveCustom}
                  className="h-9 rounded-full bg-foreground px-4 text-sm text-background hover:opacity-90 transition whitespace-nowrap font-medium flex-1"
                >
                  Save Preferences
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

