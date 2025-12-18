"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { updateQueryParam } from "@/lib/url/query";
import { REGION_TO_COUNTRIES, getCountryName, getProvincesForCountry, getProvinceName } from "@/lib/news/region-map";

type Option = { label: string; value: string };

export function FiltersBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const filters = {
    category: searchParams.get("category") || "",
    region: searchParams.get("region") || "",
    country: searchParams.get("country") || "",
    province: searchParams.get("province") || "",
    time: searchParams.get("time") || "",
    sort: searchParams.get("sort") || "publishedAt",
  };

  const handleFilterChange = (key: string, value: string) => {
    console.log("[FiltersBar] Filter change:", key, "=", value);
    let params = new URLSearchParams(searchParams);
    
    // Update the changed filter
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    // Clear province when country changes
    if (key === "country" && !value) {
      params.delete("province");
    }
    // Clear province when region changes (since country gets cleared)
    if (key === "region") {
      params.delete("province");
      // Also clear country when region changes
      params.delete("country");
    }
    
    const newUrl = `/?${params.toString()}`;
    console.log("[FiltersBar] Navigating to:", newUrl);
    router.push(newUrl);
  };

  const clearFilters = () => {
    router.push("/");
  };

  const selectedRegion = filters.region;
  const availableCountries = selectedRegion
    ? REGION_TO_COUNTRIES[selectedRegion] || []
    : [];
  
  const selectedCountry = filters.country;
  const availableProvinces = selectedCountry
    ? getProvincesForCountry(selectedCountry)
    : [];

  const isFiltered = useMemo(() => {
    return filters.category !== "" || filters.region !== "" || filters.country !== "" || filters.province !== "" || filters.time !== "";
  }, [filters.category, filters.region, filters.country, filters.province, filters.time]);

  const categoryOptions: Option[] = [
    { value: "", label: "All Categories" },
    { value: "business", label: "Business" },
    { value: "technology", label: "Technology" },
    { value: "sports", label: "Sports" },
    { value: "health", label: "Health" },
    { value: "science", label: "Science" },
    { value: "entertainment", label: "Entertainment" },
    { value: "general", label: "General" },
  ];

  const regionOptions: Option[] = [
    { value: "", label: "All Regions" },
    { value: "africa", label: "Africa" },
    { value: "europe", label: "Europe" },
    { value: "americas", label: "Americas" },
    { value: "asia", label: "Asia" },
    { value: "middle_east", label: "Middle East" },
    { value: "oceania", label: "Oceania" },
  ];

  const timeOptions: Option[] = [
    { value: "", label: "All Time" },
    { value: "24h", label: "24 Hours" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
  ];

  const sortOptions: Option[] = [
    { value: "publishedAt", label: "Latest" },
    { value: "relevancy", label: "Relevance" },
  ];

  return (
    <div className="sticky top-[64px] z-30 border-b border-border/20 bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/55 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [-webkit-overflow-scrolling:touch]">
          <ChipSelect
            label="Category"
            value={filters.category}
            onChange={(value) => handleFilterChange("category", value)}
            options={categoryOptions}
          />
          <ChipSelect
            label="Region"
            value={filters.region}
            onChange={(value) => {
              let params = new URLSearchParams(searchParams);
              
              // Update region
              if (value) {
                params.set("region", value);
              } else {
                params.delete("region");
              }
              
              // Clear country and province when region changes
              params.delete("country");
              params.delete("province");
              
              const newUrl = `/?${params.toString()}`;
              console.log("[FiltersBar] Region change - Navigating to:", newUrl);
              router.push(newUrl);
            }}
            options={regionOptions}
          />
          {selectedRegion && availableCountries.length > 0 && (
            <ChipSelect
              label="Country"
              value={filters.country}
              onChange={(value) => handleFilterChange("country", value)}
              options={[
                { value: "", label: "All Countries" },
                ...availableCountries.map((code) => ({
                  value: code,
                  label: getCountryName(code),
                })),
              ]}
            />
          )}
          {selectedCountry && availableProvinces.length > 0 && (
            <ChipSelect
              label="Province"
              value={filters.province}
              onChange={(value) => handleFilterChange("province", value)}
              options={[
                { value: "", label: "All Provinces" },
                ...availableProvinces.map((code) => ({
                  value: code,
                  label: getProvinceName(code),
                })),
              ]}
            />
          )}
          <ChipSelect
            label="Time"
            value={filters.time}
            onChange={(value) => handleFilterChange("time", value)}
            options={timeOptions}
          />
          <ChipSelect
            label="Sort"
            value={filters.sort}
            onChange={(value) => handleFilterChange("sort", value)}
            options={sortOptions}
          />

          <div className="ml-auto flex items-center gap-2">
            {isFiltered && (
              <button
                onClick={clearFilters}
                className="rounded-full bg-background/60 dark:bg-white/5 backdrop-blur border border-border/20 dark:border-white/10 px-3 py-1.5 text-sm hover:bg-background/80 dark:hover:bg-white/10 transition whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ChipSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: Option[];
}) {
  return (
    <label className="group relative">
      <span className="sr-only">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-full bg-background/60 dark:bg-white/5 backdrop-blur border border-border/20 dark:border-white/10 px-4 py-2 pr-9 text-sm shadow-sm hover:bg-background/80 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--brand)/0.35)] transition whitespace-nowrap"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
        ▼
      </span>
    </label>
  );
}
