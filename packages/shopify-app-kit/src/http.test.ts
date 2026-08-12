import { describe, expect, it, vi } from "vitest";
import { createHttpClient, http } from "@standhigher/shopify-app-kit/http";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    headers: { "content-type": "application/json" },
    ...init
  });
}

describe("core http", () => {
  it("unwraps backend success envelopes and sends request ids", async () => {
    const fetchSpy = vi.fn().mockResolvedValue(
      jsonResponse({
        code: "SUCCESS",
        message: "success",
        data: { id: 1 },
        traceId: "trace-123"
      })
    );
    const client = createHttpClient({ fetch: fetchSpy });

    await expect(client.get<{ id: number }>("/api/orders")).resolves.toEqual({ id: 1 });

    const [, request] = fetchSpy.mock.calls[0] ?? [];
    expect(request?.method).toBe("GET");
    expect(new Headers(request?.headers).get("x-request-id")).toEqual(expect.any(String));
  });

  it("normalizes backend business errors from success HTTP responses", async () => {
    const client = createHttpClient({
      fetch: vi.fn().mockResolvedValue(
        jsonResponse({
          code: "ORDER_NOT_FOUND",
          message: "Order not found",
          data: null,
          traceId: "trace-456",
          details: { orderId: "1001" }
        })
      )
    });

    await expect(client.get("/api/orders/1001")).rejects.toMatchObject({
      code: "ORDER_NOT_FOUND",
      message: "Order not found",
      requestId: "trace-456",
      details: { orderId: "1001" }
    });
  });

  it("retries GET requests for network errors", async () => {
    const fetchSpy = vi
      .fn()
      .mockRejectedValueOnce(new TypeError("network down"))
      .mockResolvedValueOnce(
        jsonResponse({
          code: "SUCCESS",
          message: "success",
          data: { ok: true },
          traceId: "trace-789"
        })
      );
    const client = createHttpClient({ fetch: fetchSpy, retry: 1 });

    await expect(client.get("/api/health")).resolves.toEqual({ ok: true });
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it("does not retry POST requests by default", async () => {
    const fetchSpy = vi.fn().mockRejectedValue(new TypeError("network down"));
    const client = createHttpClient({ fetch: fetchSpy, retry: 2 });

    await expect(client.post("/api/orders", { id: 1 })).rejects.toMatchObject({
      code: "NETWORK_ERROR"
    });
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("normalizes timeouts with the generated request id", async () => {
    const fetchSpy = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => {
          init?.signal?.addEventListener("abort", () => {
            reject(new DOMException("The operation was aborted.", "AbortError"));
          });
        })
    );
    const client = createHttpClient({ fetch: fetchSpy, timeout: 1 });

    await expect(client.get("/api/slow")).rejects.toMatchObject({
      code: "TIMEOUT",
      message: "Request timed out"
    });
  });

  it("exports a default http client", () => {
    expect(http.get).toEqual(expect.any(Function));
    expect(http.post).toEqual(expect.any(Function));
    expect(http.put).toEqual(expect.any(Function));
    expect(http.delete).toEqual(expect.any(Function));
  });
});
