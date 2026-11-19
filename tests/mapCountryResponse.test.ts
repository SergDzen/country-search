import { describe, expect, it } from "vitest";
import { mapCountryResponse } from "../src/utils/mapCountryResponse.js";
import type { CountryResponse } from "../src/types/country.js";

describe("mapCountryResponse", () => {
  it("maps API response to Country model", () => {
    const response = {
      name: "Poland",
      capital: "Warsaw",
      region: "Europe",
      subregion: "Eastern Europe",
      population: 37950802,
      area: 312679,
      borders: ["DEU", "CZE", "SVK", "UKR", "BLR", "LTU", "RUS"],
      languages: [
        {
          name: "Polish",
          iso639_1: "pl",
          iso639_2: "pol",
          nativeName: "Polski",
        },
      ],
      currencies: [
        {
          code: "PLN",
          name: "Polish złoty",
          symbol: "zł",
        },
      ],
      flags: {
        png: "https://flagcdn.com/w320/pl.png",
        svg: "https://flagcdn.com/pl.svg",
      },
    } as CountryResponse;

    expect(mapCountryResponse(response)).toEqual({
      name: "Poland",
      capital: "Warsaw",
      region: "Europe",
      subregion: "Eastern Europe",
      population: 37950802,
      area: 312679,
      flagUrl: "https://flagcdn.com/pl.svg",
      borders: ["DEU", "CZE", "SVK", "UKR", "BLR", "LTU", "RUS"],
      languages: ["Polish"],
      currencies: [
        {
          code: "PLN",
          name: "Polish złoty",
          symbol: "zł",
        },
      ],
    });
  });
});
