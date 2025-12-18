"use client";

import * as React from "react";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { getTheme } from "@/lib/preferences/storage";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [initialTheme, setInitialTheme] = useState<"light" | "dark" | "system">("system");

  useEffect(() => {
    setMounted(true);
    // Load theme preference from cookie
    const savedTheme = getTheme();
    if (savedTheme) {
      setInitialTheme(savedTheme);
    }
  }, []);

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={initialTheme}
      enableSystem
      disableTransitionOnChange={false}
      storageKey="insight-theme"
    >
      {children}
    </ThemeProvider>
  );
}
