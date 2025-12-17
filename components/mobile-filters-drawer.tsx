"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filters } from "@/lib/news/types";
import { updateQueryParam } from "@/lib/url/query";
import { REGION_TO_COUNTRIES, getCountryName } from "@/lib/news/region-map";

interface MobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFiltersDrawer({
  isOpen,
  onClose,
}: MobileFiltersDrawerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = {
    category: searchParams.get("category") || "",
    region: searchParams.get("region") || "",
    country: searchParams.get("country") || "",
    time: searchParams.get("time") || "",
    sort: searchParams.get("sort") || "publishedAt",
  };

  const handleFilterChange = (key: string, value: string) => {
    const queryString = updateQueryParam(
      key,
      value || null,
      searchParams
    );
    router.push(`/?${queryString}`);
  };

  const clearFilters = () => {
    router.push("/");
    onClose();
  };

  const selectedRegion = filters.region;
  const availableCountries = selectedRegion
    ? REGION_TO_COUNTRIES[selectedRegion] || []
    : [];

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-card shadow-xl">
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b p-4">
            <h2 className="text-lg font-semibold">Filters</h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 hover:bg-muted"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {/* Category */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Category
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange("category", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">All Categories</option>
                <option value="business">Business</option>
                <option value="technology">Technology</option>
                <option value="sports">Sports</option>
                <option value="health">Health</option>
                <option value="science">Science</option>
                <option value="entertainment">Entertainment</option>
                <option value="general">General</option>
              </select>
            </div>

            {/* Region */}
            <div>
              <label className="mb-2 block text-sm font-medium">Region</label>
              <select
                value={filters.region}
                onChange={(e) => {
                  handleFilterChange("region", e.target.value);
                  handleFilterChange("country", ""); // Clear country when region changes
                }}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">All Regions</option>
                <option value="africa">Africa</option>
                <option value="europe">Europe</option>
                <option value="americas">Americas</option>
                <option value="asia">Asia</option>
                <option value="middle_east">Middle East</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>

            {/* Country */}
            {selectedRegion && availableCountries.length > 0 && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Country
                </label>
                <select
                  value={filters.country}
                  onChange={(e) =>
                    handleFilterChange("country", e.target.value)
                  }
                  className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                >
                  <option value="">All Countries</option>
                  {availableCountries.map((code) => (
                    <option key={code} value={code}>
                      {getCountryName(code)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Time Range */}
            <div>
              <label className="mb-2 block text-sm font-medium">
                Time Range
              </label>
              <select
                value={filters.time}
                onChange={(e) => handleFilterChange("time", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="">All Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
              </select>
            </div>

            {/* Sort */}
            <div>
              <label className="mb-2 block text-sm font-medium">Sort By</label>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
              >
                <option value="publishedAt">Latest</option>
                <option value="relevancy">Relevance</option>
              </select>
            </div>
          </div>

          <div className="border-t p-4">
            <button
              onClick={clearFilters}
              className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80"
            >
              Clear All Filters
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

