"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { updateQueryParam } from "@/lib/url/query";
import { REGION_TO_COUNTRIES, getCountryName } from "@/lib/news/region-map";

export function FiltersPanel() {
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
  };

  const selectedRegion = filters.region;
  const availableCountries = selectedRegion
    ? REGION_TO_COUNTRIES[selectedRegion] || []
    : [];

  return (
    <div className="hidden lg:block w-64 flex-shrink-0 border-r bg-card p-6 sticky top-0 h-screen overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
      </div>

      <div className="space-y-6">
        {/* Category */}
        <div>
          <label className="mb-2 block text-sm font-medium">Category</label>
          <select
            value={filters.category}
            onChange={(e) => handleFilterChange("category", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            <label className="mb-2 block text-sm font-medium">Country</label>
            <select
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
              className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
          <label className="mb-2 block text-sm font-medium">Time Range</label>
          <select
            value={filters.time}
            onChange={(e) => handleFilterChange("time", e.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="publishedAt">Latest</option>
            <option value="relevancy">Relevance</option>
          </select>
        </div>

        {/* Clear Filters */}
        <button
          onClick={clearFilters}
          className="w-full rounded-md bg-secondary px-4 py-2 text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
}

