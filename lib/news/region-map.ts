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

