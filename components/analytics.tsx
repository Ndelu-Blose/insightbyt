"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { hasAnalyticsConsent } from "@/lib/cookies/consent";
import { useEffect, useState } from "react";

/**
 * Conditional Analytics component that only renders if user has consented
 */
export function ConditionalAnalytics() {
  const [mounted, setMounted] = useState(false);
  const [hasConsent, setHasConsent] = useState(false);

  useEffect(() => {
    setMounted(true);
    setHasConsent(hasAnalyticsConsent());
  }, []);

  // Only render analytics if user has consented
  if (!mounted || !hasConsent) {
    return null;
  }

  return <VercelAnalytics />;
}

