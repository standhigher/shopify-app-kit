import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { ShopifyAppKitProvider } from "@standhigher/shopify-app-kit/core";
import { useAppNavigation } from "@standhigher/shopify-app-kit/navigation";

describe("navigation", () => {
  it("delegates app navigation to the configured adapter", async () => {
    const navigate = vi.fn();
    const wrapper = ({ children }: PropsWithChildren) => (
      <ShopifyAppKitProvider appName="Demo" navigation={{ navigate }}>
        {children}
      </ShopifyAppKitProvider>
    );

    const { result } = renderHook(() => useAppNavigation(), { wrapper });

    await result.current.navigate("/settings");

    expect(navigate).toHaveBeenCalledWith("/settings");
  });

  it("uses the App Bridge runtime when no adapter is configured", async () => {
    const navigate = vi.fn();
    (window as Window & { shopify?: unknown }).shopify = { navigate };
    const { result } = renderHook(() => useAppNavigation(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <ShopifyAppKitProvider appName="Demo">{children}</ShopifyAppKitProvider>
      )
    });
    await result.current.navigate("/orders");
    expect(navigate).toHaveBeenCalledWith("/orders");
    delete (window as Window & { shopify?: unknown }).shopify;
  });

  it("rejects unsafe external URLs", async () => {
    const { result } = renderHook(() => useAppNavigation(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <ShopifyAppKitProvider appName="Demo">{children}</ShopifyAppKitProvider>
      )
    });

    await expect(result.current.openExternal("javascript:alert(1)")).rejects.toThrow(
      /Unsafe URL/
    );
  });

  it("rejects unsafe admin targets", async () => {
    const { result } = renderHook(() => useAppNavigation(), {
      wrapper: ({ children }: PropsWithChildren) => (
        <ShopifyAppKitProvider appName="Demo">{children}</ShopifyAppKitProvider>
      )
    });

    await expect(result.current.openAdmin("https://evil.example")).rejects.toThrow(
      /Admin path/
    );
  });
});
