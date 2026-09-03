import type React from "react";
import { AppProvider, Frame } from "@shopify/polaris";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { ToastProvider } from "@standhigher/shopify-app-kit/feedback";

export function BasicProviderExample({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider i18n={{}}>
      <Frame>
        <ShopifyAppKitProvider
          appName="Fulfillment Desk"
          shop="demo.myshopify.com"
          messages={{ save: "Apply changes" }}
        >
          <ToastProvider>{children}</ToastProvider>
        </ShopifyAppKitProvider>
      </Frame>
    </AppProvider>
  );
}
