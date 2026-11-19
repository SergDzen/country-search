import { HttpError } from "../src/api/HttpError.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { searchCountries } from "../src/api/searchCountries.js";

describe("searchCountries", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns countries when API responds successfully", async () => {
    const countries = [{ name: "Poland" }];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => countries,
    });

    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();
    const result = await searchCountries("poland", controller.signal);

    expect(result).toEqual(countries);
    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock).toHaveBeenCalledWith(
      "https://countries.dev/name/poland",
      expect.objectContaining({
        signal: expect.any(AbortSignal),
      }),
    );
  });

  it("returns an empty array when API responds with 404", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
      }),
    );

    const controller = new AbortController();
    const result = await searchCountries("unknown-country", controller.signal);

    expect(result).toEqual([]);
  });

  it("throws an error for HTTP 500", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      }),
    );

    const controller = new AbortController();

    await expect(
      searchCountries("poland", controller.signal),
    ).rejects.toBeInstanceOf(HttpError);
  });
});
