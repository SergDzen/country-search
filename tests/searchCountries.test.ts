import { HttpError } from "../src/api/HttpError.js";
import { afterEach, describe, expect, it, vi } from "vitest";
import { searchCountries } from "../src/api/searchCountries.js";

describe("searchCountries", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns mapped countries when API responds successfully", async () => {
    const countries = [
      {
        name: "Poland",
        capital: "Warsaw",
        region: "Europe",
        population: 37950802,
        area: 312679,
        flags: {
          png: "https://flagcdn.com/w320/pl.png",
          svg: "https://flagcdn.com/pl.svg",
        },
      },
    ];

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => countries,
    });

    vi.stubGlobal("fetch", fetchMock);

    const controller = new AbortController();
    const result = await searchCountries("poland", controller.signal);

    expect(result).toEqual([
      {
        name: "Poland",
        capital: "Warsaw",
        region: "Europe",
        population: 37950802,
        area: 312679,
        flagUrl: "https://flagcdn.com/pl.svg",
      },
    ]);

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

  it("rejects with AbortError when request is aborted", async () => {
    const controller = new AbortController();

    const fetchMock = vi.fn().mockImplementation(
      (_url: string, options: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          options.signal.addEventListener("abort", () => {
            reject(options.signal.reason);
          });
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const request = searchCountries("poland", controller.signal);

    controller.abort();

    await expect(request).rejects.toMatchObject({
      name: "AbortError",
    });
  });

  it("rejects with TimeoutError after 5 seconds", async () => {
    const controller = new AbortController();

    const fetchMock = vi.fn().mockImplementation(
      (_url: string, options: { signal: AbortSignal }) =>
        new Promise((_resolve, reject) => {
          if (options.signal.aborted) {
            reject(options.signal.reason);
            return;
          }

          options.signal.addEventListener(
            "abort",
            () => reject(options.signal.reason),
            { once: true },
          );
        }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const timeoutSpy = vi
      .spyOn(AbortSignal, "timeout")
      .mockImplementation((milliseconds: number) => {
        expect(milliseconds).toBe(5000);

        const timeoutController = new AbortController();
        timeoutController.abort(
          new DOMException("The operation timed out", "TimeoutError"),
        );

        return timeoutController.signal;
      });

    try {
      await expect(
        searchCountries("poland", controller.signal),
      ).rejects.toMatchObject({
        name: "TimeoutError",
      });

      expect(timeoutSpy).toHaveBeenCalledWith(5000);
    } finally {
      timeoutSpy.mockRestore();
    }
  });
});
