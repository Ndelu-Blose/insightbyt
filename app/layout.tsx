import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "./providers";
import { Header } from "@/components/header";
import { CookieBanner } from "@/components/cookie-banner";
import { ConditionalAnalytics } from "@/components/analytics";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Insight by T - News Intelligence",
  description: "Filter-first news intelligence website that helps you find signal over noise",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} bg-background text-foreground antialiased`}>
        <Providers>
          <div className="min-h-dvh bg-[radial-gradient(1200px_circle_at_20%_-10%,hsl(var(--brand)/0.18),transparent_55%),radial-gradient(900px_circle_at_80%_0%,hsl(var(--brand2)/0.14),transparent_50%)] bg-background">
            <Header />
            {children}
          </div>
          <CookieBanner />
          <ConditionalAnalytics />
        </Providers>
      </body>
    </html>
  );
}

