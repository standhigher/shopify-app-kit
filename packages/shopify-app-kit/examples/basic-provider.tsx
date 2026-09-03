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
          locale="zh-CN"
          shop="demo.myshopify.com"
          messages={{ save: "应用更改" }}
        >
          <ToastProvider>{children}</ToastProvider>
        </ShopifyAppKitProvider>
      </Frame>
    </AppProvider>
  );
}
