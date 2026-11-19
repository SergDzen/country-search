import { describe, expect, it } from "vitest";
import { HttpError } from "../src/api/HttpError.js";

describe("HttpError", () => {
  it("extends the built-in Error class", () => {
    const error = new HttpError(500, "Internal Server Error");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(HttpError);
  });

  it("stores the HTTP status", () => {
    const error = new HttpError(404, "Not Found");

    expect(error.status).toBe(404);
  });

  it("stores the error message", () => {
    const error = new HttpError(500, "Internal Server Error");

    expect(error.message).toBe("Internal Server Error");
  });

  it("has the correct error name", () => {
    const error = new HttpError(403, "Forbidden");

    expect(error.name).toBe("HttpError");
  });
});
