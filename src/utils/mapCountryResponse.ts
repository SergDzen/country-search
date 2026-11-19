import type { CountryResponse } from "../types/country.js";
import type { Country } from "../types/country.js";

export function mapCountryResponse(response: CountryResponse): Country {
  return {
    name: response.name,
    capital: response.capital,
    region: response.region,
    population: response.population,
    area: response.area,
    flagUrl: response.flags.svg,
  };
}
