import { useCallback } from "react";
import { useShopifyAppKit } from "../providers/ShopifyAppKitContext";
import { getAppBridgeRuntime } from "../runtime/appBridgeRuntime";
import type { AdminTarget, AppNavigation, OpenExternalOptions } from "./navigation-types";

const SAFE_PROTOCOLS = new Set(["http:", "https:", "mailto:"]);

function getWindow(): Window | undefined {
  return typeof window === "undefined" ? undefined : window;
}

function assertSafeUrl(url: string): URL {
  const parsed = new URL(url, getWindow()?.location.origin ?? "https://example.com");
  if (!SAFE_PROTOCOLS.has(parsed.protocol)) {
    throw new Error("Unsafe URL protocol.");
  }
  return parsed;
}

function normalizeAdminPath(input: AdminTarget): string {
  const path = typeof input === "string" ? input : input.path;
  if (!path.startsWith("/") || path.startsWith("//") || /^[a-z][a-z0-9+.-]*:/i.test(path)) {
    throw new Error("Admin path must be a relative Shopify Admin path.");
  }
  return path;
}

export function useAppNavigation(): AppNavigation {
  const { navigation } = useShopifyAppKit();

  const navigate = useCallback(
    async (path: string) => {
      if (!path.startsWith("/") || path.startsWith("//")) {
        throw new Error("App navigation path must start with a single slash.");
      }

      if (navigation?.navigate) {
        await navigation.navigate(path);
        return;
      }

      const runtime = getAppBridgeRuntime();
      if (runtime?.navigate) {
        await runtime.navigate(path);
        return;
      }
      if (runtime?.navigation?.navigate) {
        await runtime.navigation.navigate(path);
        return;
      }

      getWindow()?.location.assign(path);
    },
    [navigation]
  );

  const openAdmin = useCallback(
    async (input: AdminTarget) => {
      const path = normalizeAdminPath(input);
      if (navigation?.openAdmin) {
        await navigation.openAdmin(path);
        return;
      }

      const runtime = getAppBridgeRuntime();
      if (runtime?.admin?.open) {
        await runtime.admin.open(path);
        return;
      }
      if (runtime?.navigation?.open) {
        await runtime.navigation.open(path);
        return;
      }
      if (runtime?.navigation?.navigate) {
        await runtime.navigation.navigate(path);
        return;
      }

      getWindow()?.open(`https://admin.shopify.com${path}`, "_blank", "noopener,noreferrer");
    },
    [navigation]
  );

  const openExternal = useCallback(
    async (url: string, options: OpenExternalOptions = {}) => {
      const parsed = assertSafeUrl(url);
      if (options.confirm && !(await options.confirm())) {
        return;
      }

      if (navigation?.openExternal) {
        await navigation.openExternal(parsed.toString(), options);
        return;
      }

      const target = options.newWindow === false ? "_self" : "_blank";
      getWindow()?.open(parsed.toString(), target, "noopener,noreferrer");
    },
    [navigation]
  );

  return { navigate, openAdmin, openExternal };
}
