import { createContext, useContext } from "react";
import { invariant } from "../runtime/invariant";
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
