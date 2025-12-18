import { Filters } from "@/lib/news/types";

export function getFiltersFromSearchParams(
  searchParams: URLSearchParams
): Filters {
  return {
    q: searchParams.get("q") || undefined,
    category: searchParams.get("category") || undefined,
    country: searchParams.get("country") || undefined,
    region: searchParams.get("region") || undefined,
    province: searchParams.get("province") || undefined,
    time: (searchParams.get("time") as "24h" | "7d" | "30d") || undefined,
    sort:
      (searchParams.get("sort") as "publishedAt" | "relevancy") || undefined,
  };
}

export function updateQueryParam(
  key: string,
  value: string | null,
  currentSearchParams: URLSearchParams
): string {
  const params = new URLSearchParams(currentSearchParams);
  
  if (value === null || value === "") {
    params.delete(key);
  } else {
    params.set(key, value);
  }
  
  return params.toString();
}

export function clearQueryParams(): string {
  return "";
}

export function buildQueryString(filters: Filters): string {
  const params = new URLSearchParams();
  
  if (filters.q) params.set("q", filters.q);
  if (filters.category) params.set("category", filters.category);
  if (filters.country) params.set("country", filters.country);
  if (filters.region) params.set("region", filters.region);
  if (filters.province) params.set("province", filters.province);
  if (filters.time) params.set("time", filters.time);
  if (filters.sort) params.set("sort", filters.sort);
  
  return params.toString();
}

