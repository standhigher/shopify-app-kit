import { describe, expect, it } from "vitest";
import {
  ApiError,
  isApiError,
  normalizeError
} from "@standhigher/shopify-app-kit/error";

describe("core error", () => {
  it("normalizes backend business errors with trace ids", () => {
    const error = normalizeError({
      code: "ORDER_NOT_FOUND",
      message: "Order not found",
      data: null,
      traceId: "trace-123",
      details: { orderId: "1001" }
    });

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      code: "ORDER_NOT_FOUND",
      message: "Order not found",
      requestId: "trace-123",
      details: { orderId: "1001" }
    });
    expect(isApiError(error)).toBe(true);
  });

  it("normalizes unknown errors without leaking implementation details", () => {
    const error = normalizeError(new Error("Failed to fetch"));

    expect(error).toMatchObject({
      code: "NETWORK_ERROR",
      message: "Failed to fetch"
    });
  });

  it("preserves an existing ApiError when normalizing it again", () => {
    const original = new ApiError({
      code: "FORBIDDEN",
      message: "Forbidden",
      status: 403,
      requestId: "trace-1",
      details: { reason: "role" }
    });

    expect(normalizeError(original)).toMatchObject({
      code: "FORBIDDEN",
      message: "Forbidden",
      status: 403,
      requestId: "trace-1",
      details: { reason: "role" }
    });
  });
});
