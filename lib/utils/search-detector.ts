import { getProvinceCode, getProvinceName } from "@/lib/news/region-map";

export interface DetectedLocation {
  country?: string;
  province?: string;
  remainingQuery: string;
}

/**
 * Detect country and province names in a search query
 * Returns detected location codes and the remaining query text
 */
export function detectLocationInQuery(query: string): DetectedLocation {
  if (!query || query.trim().length === 0) {
    return { remainingQuery: query };
  }

  const normalizedQuery = query.toLowerCase().trim();
  let remainingQuery = query;
  let detectedCountry: string | undefined;
  let detectedProvince: string | undefined;

  // List of all country names and codes for detection
  const countryMappings: Array<{ name: string; code: string }> = [
    { name: "south africa", code: "za" },
    { name: "nigeria", code: "ng" },
    { name: "kenya", code: "ke" },
    { name: "egypt", code: "eg" },
    { name: "ghana", code: "gh" },
    { name: "united kingdom", code: "gb" },
    { name: "uk", code: "gb" },
    { name: "france", code: "fr" },
    { name: "germany", code: "de" },
    { name: "italy", code: "it" },
    { name: "spain", code: "es" },
    { name: "united states", code: "us" },
    { name: "usa", code: "us" },
    { name: "canada", code: "ca" },
    { name: "brazil", code: "br" },
    { name: "mexico", code: "mx" },
    { name: "argentina", code: "ar" },
    { name: "india", code: "in" },
    { name: "japan", code: "jp" },
    { name: "south korea", code: "kr" },
    { name: "singapore", code: "sg" },
    { name: "indonesia", code: "id" },
    { name: "saudi arabia", code: "sa" },
    { name: "united arab emirates", code: "ae" },
    { name: "uae", code: "ae" },
    { name: "israel", code: "il" },
    { name: "qatar", code: "qa" },
    { name: "australia", code: "au" },
    { name: "new zealand", code: "nz" },
  ];

  // Try to detect country first
  for (const { name, code } of countryMappings) {
    const regex = new RegExp(`\\b${name}\\b`, "gi");
    if (regex.test(normalizedQuery)) {
      detectedCountry = code;
      remainingQuery = remainingQuery.replace(regex, "").trim();
      break;
    }
  }

  // Try to detect province (works best if country is known)
  // Check the full query first, then check remaining query after country removal
  const queryToCheck = remainingQuery.toLowerCase();
  const provinceCode = getProvinceCode(queryToCheck, detectedCountry);
  if (provinceCode) {
    detectedProvince = provinceCode;
    // Remove province name from query
    const provinceName = getProvinceName(provinceCode);
    if (provinceName) {
      const provinceRegex = new RegExp(
        provinceName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "gi"
      );
      remainingQuery = remainingQuery.replace(provinceRegex, "").trim();
    }
    // Also remove province code if it appears
    const codeRegex = new RegExp(
      provinceCode.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "gi"
    );
    remainingQuery = remainingQuery.replace(codeRegex, "").trim();
  }

  // Clean up remaining query (remove extra spaces, commas, etc.)
  remainingQuery = remainingQuery
    .replace(/[,\s]+/g, " ")
    .trim();

  return {
    country: detectedCountry,
    province: detectedProvince,
    remainingQuery: remainingQuery || "",
  };
}

