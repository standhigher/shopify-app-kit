export type AppKitEnvironment = "embedded" | "non_embedded" | "local_dev" | "ssr";

export function detectEnvironment(): AppKitEnvironment {
  if (typeof window === "undefined") {
    return "ssr";
  }

  const host = window.location.hostname;
  if (host === "localhost" || host === "127.0.0.1") {
    return "local_dev";
  }

  const hasShopifyGlobal = "shopify" in window;
  const isEmbedded = window.self !== window.top || hasShopifyGlobal;

  return isEmbedded ? "embedded" : "non_embedded";
}
