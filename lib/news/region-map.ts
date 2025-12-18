export const REGION_TO_COUNTRIES: Record<string, string[]> = {
  africa: ["za", "ng", "ke", "eg", "gh"],
  europe: ["gb", "fr", "de", "it", "es"],
  americas: ["us", "ca", "br", "mx", "ar"],
  asia: ["in", "jp", "kr", "sg", "id"],
  middle_east: ["sa", "ae", "il", "qa", "eg"],
  oceania: ["au", "nz"],
};

export function getCountriesForRegion(region: string): string[] {
  return REGION_TO_COUNTRIES[region] || [];
}

export function getAllCountries(): string[] {
  return Object.values(REGION_TO_COUNTRIES).flat();
}

export function getCountryName(code: string): string {
  const countryNames: Record<string, string> = {
    za: "South Africa",
    ng: "Nigeria",
    ke: "Kenya",
    eg: "Egypt",
    gh: "Ghana",
    gb: "United Kingdom",
    fr: "France",
    de: "Germany",
    it: "Italy",
    es: "Spain",
    us: "United States",
    ca: "Canada",
    br: "Brazil",
    mx: "Mexico",
    ar: "Argentina",
    in: "India",
    jp: "Japan",
    kr: "South Korea",
    sg: "Singapore",
    id: "Indonesia",
    sa: "Saudi Arabia",
    ae: "United Arab Emirates",
    il: "Israel",
    qa: "Qatar",
    au: "Australia",
    nz: "New Zealand",
  };
  return countryNames[code] || code.toUpperCase();
}

// Province/State mappings by country
export const COUNTRY_TO_PROVINCES: Record<string, string[]> = {
  za: [
    "gauteng",
    "western-cape",
    "eastern-cape",
    "kwazulu-natal",
    "limpopo",
    "mpumalanga",
    "north-west",
    "northern-cape",
    "free-state",
  ],
};

// Province names mapping
export function getProvinceName(code: string): string {
  const provinceNames: Record<string, string> = {
    // South Africa
    gauteng: "Gauteng",
    "western-cape": "Western Cape",
    "eastern-cape": "Eastern Cape",
    "kwazulu-natal": "KwaZulu-Natal",
    limpopo: "Limpopo",
    mpumalanga: "Mpumalanga",
    "north-west": "North West",
    "northern-cape": "Northern Cape",
    "free-state": "Free State",
  };
  return provinceNames[code] || code;
}

// Get provinces for a country
export function getProvincesForCountry(country: string): string[] {
  return COUNTRY_TO_PROVINCES[country] || [];
}

// City to province mapping (for search detection)
const CITY_TO_PROVINCE: Record<string, { province: string; country: string }> = {
  // South Africa cities
  "cape town": { province: "western-cape", country: "za" },
  "johannesburg": { province: "gauteng", country: "za" },
  "pretoria": { province: "gauteng", country: "za" },
  "durban": { province: "kwazulu-natal", country: "za" },
  "port elizabeth": { province: "eastern-cape", country: "za" },
  "east london": { province: "eastern-cape", country: "za" },
  "bloemfontein": { province: "free-state", country: "za" },
  "polokwane": { province: "limpopo", country: "za" },
  "nelspruit": { province: "mpumalanga", country: "za" },
  "mahikeng": { province: "north-west", country: "za" },
  "kimberley": { province: "northern-cape", country: "za" },
};

// Get province code from name or city name
export function getProvinceCode(
  name: string,
  country?: string
): string | undefined {
  const normalized = name.toLowerCase().trim();

  // Check city mapping first
  const cityMatch = CITY_TO_PROVINCE[normalized];
  if (cityMatch && (!country || cityMatch.country === country)) {
    return cityMatch.province;
  }

  // Check province name mapping
  const provinces = country
    ? getProvincesForCountry(country)
    : Object.values(COUNTRY_TO_PROVINCES).flat();
  
  for (const code of provinces) {
    const provinceName = getProvinceName(code).toLowerCase();
    if (
      provinceName === normalized ||
      provinceName.replace(/\s+/g, "-") === normalized ||
      code === normalized
    ) {
      return code;
    }
  }

  return undefined;
}

