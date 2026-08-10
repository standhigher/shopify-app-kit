import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import {
  useCollectionPicker,
  useProductPicker
} from "@standhigher/shopify-app-kit/resource-picker";

describe("resource picker", () => {
  it("returns product selections from the configured adapter", async () => {
    const openProductPicker = vi.fn().mockResolvedValue({
      canceled: false,
      selection: [{ id: "gid://shopify/Product/1", title: "Hat" }]
    });
    const wrapper = ({ children }: PropsWithChildren) => (
      <ShopifyAppKitProvider
        appName="Demo"
        resourcePicker={{ openProductPicker }}
      >
        {children}
      </ShopifyAppKitProvider>
    );

    const { result } = renderHook(() => useProductPicker(), { wrapper });

    await expect(result.current.open({ multiple: true })).resolves.toEqual({
      canceled: false,
      selection: [{ id: "gid://shopify/Product/1", title: "Hat" }]
    });
  });

  it("returns a clear canceled result when no collection adapter exists", async () => {
    const { result } = renderHook(() => useCollectionPicker(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <ShopifyAppKitProvider appName="Demo">{children}</ShopifyAppKitProvider>
      )
    });

    await expect(result.current.open()).resolves.toEqual({
      canceled: true,
      selection: []
    });
  });

  it("does not swallow picker adapter errors", async () => {
    const openProductPicker = vi.fn().mockRejectedValue(new Error("picker failed"));
    const wrapper = ({ children }: PropsWithChildren) => (
      <ShopifyAppKitProvider
        appName="Demo"
        resourcePicker={{ openProductPicker }}
      >
        {children}
      </ShopifyAppKitProvider>
    );

    const { result } = renderHook(() => useProductPicker(), { wrapper });

    await expect(result.current.open()).rejects.toThrow("picker failed");
  });
});
