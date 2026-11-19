import { mapCountryResponse } from "../utils/mapCountryResponse.js";
import type { Country } from "../types/country.js";
import type { CountryResponse } from "../types/country.js";
import { HttpError } from "./HttpError.js";

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<Country[]> {
  const url = `https://countries.dev/name/${encodeURIComponent(query)}`;

  const combinedSignal = AbortSignal.any([signal, AbortSignal.timeout(5000)]);

  const response = await fetch(url, {
    signal: combinedSignal,
  });

  if (response.status === 404) {
    return [];
  }

  if (!response.ok) {
    throw new HttpError(response.status, `HTTP error: ${response.status}`);
  }

  const countries = (await response.json()) as CountryResponse[];

  return countries.map(mapCountryResponse);
}
