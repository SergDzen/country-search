import { HttpError } from "../api/HttpError.js";

export type SearchErrorType =
  "aborted" | "timeout" | "http" | "network" | "unknown";

export function classifySearchError(error: unknown): SearchErrorType {
  if (error instanceof DOMException) {
    if (error.name === "AbortError") {
      return "aborted";
    }

    if (error.name === "TimeoutError") {
      return "timeout";
    }
  }

  if (error instanceof HttpError) {
    return "http";
  }

  if (error instanceof TypeError) {
    return "network";
  }

  return "unknown";
}
