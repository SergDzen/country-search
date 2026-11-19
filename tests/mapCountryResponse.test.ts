import { describe, expect, it } from "vitest";
import { mapCountryResponse } from "../src/utils/mapCountryResponse.js";
import type { CountryResponse } from "../src/types/country.js";

describe("mapCountryResponse", () => {
  it("maps API response to Country model", () => {
    const response = {
      name: "Poland",
      capital: "Warsaw",
      region: "Europe",
      population: 37950802,
      area: 312679,
      flags: {
        png: "https://flagcdn.com/w320/pl.png",
        svg: "https://flagcdn.com/pl.svg",
      },
    } as CountryResponse;

    expect(mapCountryResponse(response)).toEqual({
      name: "Poland",
      capital: "Warsaw",
      region: "Europe",
      population: 37950802,
      area: 312679,
      flagUrl: "https://flagcdn.com/pl.svg",
    });
  });
});
