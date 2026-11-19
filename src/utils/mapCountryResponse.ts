import type { Country, CountryResponse } from "../types/country.js";

export function mapCountryResponse(response: CountryResponse): Country {
  return {
    name: response.name,
    capital: response.capital,
    region: response.region,
    subregion: response.subregion,
    population: response.population,
    area: response.area,
    flagUrl: response.flags.svg || response.flags.png,
    borders: response.borders ?? [],
    languages: (response.languages ?? []).map((language) => language.name),
    currencies: response.currencies ?? [],
  };
}
