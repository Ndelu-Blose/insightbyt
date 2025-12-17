'use client';

import * as React from "react";
// Temporarily disabled to fix React compatibility issues
// import { ThemeProvider } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  // Temporarily return children directly without ThemeProvider
  return <>{children}</>;
  
  // Will restore after React version fix:
  // return (
  //   <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
  //     {children}
  //   </ThemeProvider>
  // );
}

