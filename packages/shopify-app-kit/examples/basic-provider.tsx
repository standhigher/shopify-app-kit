import type React from "react";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";

export function BasicProviderExample({ children }: { children: React.ReactNode }) {
  return (
    <ShopifyAppKitProvider
      appName="Fulfillment Desk"
      shop="demo.myshopify.com"
      messages={{ save: "Apply changes" }}
    >
      {children}
    </ShopifyAppKitProvider>
  );
}
