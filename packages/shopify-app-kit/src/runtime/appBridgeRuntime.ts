export interface AppBridgeRuntime {
  saveBar?: {
    show: (id: string) => void | Promise<void>;
    hide: (id: string) => void | Promise<void>;
  };
}

export function getAppBridgeRuntime(): AppBridgeRuntime | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const maybeWindow = window as typeof window & { shopify?: AppBridgeRuntime };
  return maybeWindow.shopify;
}
