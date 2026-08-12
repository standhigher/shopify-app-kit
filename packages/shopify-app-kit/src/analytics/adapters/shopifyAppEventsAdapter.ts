import type { AnalyticsAdapter } from "../analytics-types";

type FetchLike = typeof fetch;
type RuntimeGlobal = {
  fetch?: FetchLike;
};

export interface ShopifyAppEventsAdapterOptions {
  endpoint: string;
  fetch?: FetchLike;
}

function getRuntimeGlobal(): RuntimeGlobal | undefined {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }

  if (typeof window !== "undefined") {
    return window;
  }

  if (typeof self !== "undefined") {
    return self;
  }

  if (typeof global !== "undefined") {
    return global as RuntimeGlobal;
  }

  return Function("return this")() as RuntimeGlobal | undefined;
}

export function shopifyAppEventsAdapter({
  endpoint,
  fetch: fetchImpl = getRuntimeGlobal()?.fetch
}: ShopifyAppEventsAdapterOptions): AnalyticsAdapter {
  return {
    async track(event) {
      if (!fetchImpl) {
        throw new Error("fetch is required for shopifyAppEventsAdapter.");
      }

      const runtimeGlobal = getRuntimeGlobal();
      const fetchLike = runtimeGlobal ? fetchImpl.bind(runtimeGlobal) : fetchImpl;
      const response = await fetchLike(endpoint, {
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
