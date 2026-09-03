export interface AppBridgeRuntime {
  saveBar?: {
    show: (id: string) => void | Promise<void>;
    hide: (id: string) => void | Promise<void>;
  };
  navigate?: (path: string) => void | Promise<void>;
  navigation?: {
    navigate?: (path: string) => void | Promise<void>;
    open?: (path: string) => void | Promise<void>;
  };
  admin?: {
    open?: (path: string) => void | Promise<void>;
  };
  resourcePicker?: (options: Record<string, unknown>) => Promise<unknown> | unknown;
}

export function getAppBridgeRuntime(): AppBridgeRuntime | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  const maybeWindow = window as typeof window & { shopify?: AppBridgeRuntime };
  return maybeWindow.shopify;
}
