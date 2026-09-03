import { useMemo } from "react";
import { defaultMessages } from "../i18n/defaultMessages";
import { detectEnvironment } from "../runtime/environment";
import { ShopifyAppKitContext } from "./ShopifyAppKitContext";
import type {
  ShopifyAppKitContextValue,
  ShopifyAppKitProviderProps
} from "./provider-types";

export function ShopifyAppKitProvider({
  appName,
  children,
  locale = "en",
  shop,
  messages,
  analytics,
  navigation,
  saveBar,
  resourcePicker,
  environment
}: ShopifyAppKitProviderProps) {
  const value = useMemo<ShopifyAppKitContextValue>(
    () => ({
      appName,
      locale,
      shop,
      messages: { ...defaultMessages, ...messages },
      analytics,
      navigation,
      saveBar,
      resourcePicker,
      environment: environment ?? detectEnvironment()
    }),
    [appName, locale, shop, messages, analytics, navigation, saveBar, resourcePicker, environment]
  );

  return (
    <ShopifyAppKitContext.Provider value={value}>
      {children}
    </ShopifyAppKitContext.Provider>
  );
}
