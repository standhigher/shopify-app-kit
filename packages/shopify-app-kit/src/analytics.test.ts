import { describe, expect, it, vi } from "vitest";
import {
  createAnalytics,
  shopifyAppEventsAdapter,
  type AnalyticsAdapter
} from "@standhigher/shopify-app-kit/analytics";

describe("analytics", () => {
  it("calls adapters in order", async () => {
    const calls: string[] = [];
    const first: AnalyticsAdapter = {
      track: async () => {
        calls.push("first");
      }
    };
    const second: AnalyticsAdapter = {
      track: async () => {
        calls.push("second");
      }
    };

    await createAnalytics({ adapters: [first, second] }).track({
      name: "app_loaded",
      attributes: { surface: "settings" }
    });

    expect(calls).toEqual(["first", "second"]);
  });

  it("rejects non-scalar attributes", async () => {
    await expect(
      createAnalytics().track({
        name: "app_loaded",
        attributes: { nested: { bad: true } as never }
      })
    ).rejects.toThrow(/scalar/);
  });

  it("requires idempotencyKey for billing events", async () => {
    await expect(
      createAnalytics().track({
        name: "billing_event",
        attributes: { plan: "starter" }
      })
    ).rejects.toThrow(/idempotencyKey/);
  });

  it("posts backend app-events payloads without secrets", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });
    const adapter = shopifyAppEventsAdapter({
      endpoint: "/api/shopify/app-events",
      fetch: fetchSpy
    });

    await adapter.track({
      name: "app_loaded",
      attributes: { shop: "demo.myshopify.com" }
    });

    expect(fetchSpy).toHaveBeenCalledWith(
      "/api/shopify/app-events",
      expect.objectContaining({
        method: "POST",
        headers: { "content-type": "application/json" }
      })
    );
    const [, request] = fetchSpy.mock.calls[0] ?? [];
    expect(request?.body).not.toMatch(/secret|token|bearer/i);
  });
});
