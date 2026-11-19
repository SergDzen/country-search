import type { CountryResponse } from "../types/country.js";
import { HttpError } from "./HttpError.js";

export async function searchCountries(
  query: string,
  signal: AbortSignal,
): Promise<CountryResponse[]> {
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

  return (await response.json()) as CountryResponse[];
}
