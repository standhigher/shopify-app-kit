import { createContext, useContext } from "react";
import { invariant } from "../runtime/invariant";
import { getAnalytics } from "../analytics/globalAnalytics";
import type { ShopifyAppKitContextValue } from "./provider-types";

export const ShopifyAppKitContext =
  createContext<ShopifyAppKitContextValue | null>(null);

export function useShopifyAppKit(): ShopifyAppKitContextValue {
  const value = useContext(ShopifyAppKitContext);
  invariant(
    value,
    "useShopifyAppKit must be used inside ShopifyAppKitProvider."
  );
  return value;
}

export function useAnalytics() {
  return useShopifyAppKit().analytics ?? getAnalytics();
}
