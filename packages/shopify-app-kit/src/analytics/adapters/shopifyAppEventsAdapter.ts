import type { AnalyticsAdapter } from "../analytics-types";

export interface ShopifyAppEventsAdapterOptions {
  endpoint: string;
  fetch?: typeof globalThis.fetch;
}

export function shopifyAppEventsAdapter({
  endpoint,
  fetch: fetchImpl = globalThis.fetch
}: ShopifyAppEventsAdapterOptions): AnalyticsAdapter {
  return {
    async track(event) {
      if (!fetchImpl) {
        throw new Error("fetch is required for shopifyAppEventsAdapter.");
      }

      const response = await fetchImpl(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ event })
      });

      if (!response.ok) {
        throw new Error(`App Events backend request failed with status ${response.status}.`);
      }
    }
  };
}
