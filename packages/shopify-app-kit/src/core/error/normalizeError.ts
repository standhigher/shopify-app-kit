import { ApiError, isApiError } from "./ApiError";
import type { ApiErrorPayload, BackendEnvelope } from "./error-types";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function isBackendEnvelope(value: unknown): value is BackendEnvelope {
  return (
    isRecord(value) &&
    typeof value.code === "string" &&
    typeof value.message === "string" &&
    "data" in value &&
    typeof value.traceId === "string"
  );
}

export function isSuccessEnvelope(value: unknown): value is BackendEnvelope {
  return isBackendEnvelope(value) && value.code === "SUCCESS";
}

export function normalizeError(error: unknown, overrides: Partial<ApiErrorPayload> = {}): ApiError {
  if (isApiError(error)) {
    return new ApiError({
      code: error.code,
      message: error.message,
      status: error.status,
      requestId: error.requestId,
      details: error.details,
      ...overrides
    });
  }

  if (isBackendEnvelope(error)) {
    return new ApiError({
      code: error.code,
      message: error.message,
      requestId: error.traceId,
      details: error.details,
      ...overrides
    });
  }

  if (
    typeof DOMException !== "undefined" &&
    error instanceof DOMException &&
    error.name === "AbortError"
  ) {
    return new ApiError({
      code: "TIMEOUT",
      message: "Request timed out",
      ...overrides
    });
  }

  if (error instanceof Error) {
    return new ApiError({
      code: "NETWORK_ERROR",
      message: error.message || "Network request failed",
      ...overrides
    });
  }

  return new ApiError({
    code: "UNKNOWN_ERROR",
    message: "Unexpected API error",
    details: error,
    ...overrides
  });
}
