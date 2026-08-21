import { afterEach, describe, expect, it, vi } from "vitest";
import {
  analytics,
  createAnalytics,
  getAnalytics,
  initAnalytics,
  resetAnalytics,
  shopifyAppEventsAdapter,
  type AnalyticsAdapter
} from "@standhigher/shopify-app-kit/analytics";

describe("analytics", () => {
  afterEach(() => {
    resetAnalytics();
    vi.unstubAllEnvs();
    vi.restoreAllMocks();
  });

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

  it("falls back when globalThis is not available for app-events adapter", async () => {
    const originalGlobalThis = globalThis;
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true });

    Object.defineProperty(originalGlobalThis, "fetch", {
      configurable: true,
      value: fetchSpy
    });

    try {
      Object.defineProperty(originalGlobalThis, "globalThis", {
        configurable: true,
        value: undefined
      });

      const adapter = shopifyAppEventsAdapter({
        endpoint: "/api/shopify/app-events"
      });

      await adapter.track({
        name: "app_loaded",
        attributes: { surface: "settings" }
      });
    } finally {
      Object.defineProperty(originalGlobalThis, "globalThis", {
        configurable: true,
        value: originalGlobalThis
      });
      vi.unstubAllGlobals();
    }

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it("no-ops before global analytics is initialized", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});

    await expect(
      analytics.track({
        name: "app_loaded",
        attributes: { surface: "settings" }
      })
    ).resolves.toBeUndefined();
  });

  it("warns once in development when global analytics is not initialized", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    await analytics.track({ name: "app_loaded" });
    await analytics.track({ name: "page_viewed" });

    expect(warnSpy).toHaveBeenCalledTimes(1);
    expect(warnSpy).toHaveBeenCalledWith(
      "Analytics has not been initialized. Call initAnalytics(...) before tracking events."
    );
  });

  it("keeps the global analytics facade stable after initialization", async () => {
    const trackSpy = vi.fn();

    const client = initAnalytics({
      adapters: [{ track: trackSpy }]
    });

    expect(getAnalytics()).toBe(client);

    await analytics.track({
      name: "settings_saved",
      attributes: { surface: "shipping_rules" }
    });

    expect(trackSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: "settings_saved",
        attributes: { surface: "shipping_rules" }
      })
    );
  });

  it("replaces the global analytics client when initialized again", async () => {
    const firstTrack = vi.fn();
    const secondTrack = vi.fn();

    initAnalytics({ adapters: [{ track: firstTrack }] });
    initAnalytics({ adapters: [{ track: secondTrack }] });

    await analytics.track({ name: "page_viewed" });

    expect(firstTrack).not.toHaveBeenCalled();
    expect(secondTrack).toHaveBeenCalledTimes(1);
  });

  it("resets the global analytics client and warning state", async () => {
    vi.stubEnv("NODE_ENV", "development");
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const trackSpy = vi.fn();

    initAnalytics({ adapters: [{ track: trackSpy }] });
    resetAnalytics();

    await analytics.track({ name: "app_loaded" });

    expect(trackSpy).not.toHaveBeenCalled();
    expect(warnSpy).toHaveBeenCalledTimes(1);
  });
});
