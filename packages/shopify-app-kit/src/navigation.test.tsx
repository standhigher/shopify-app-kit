import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import { describe, expect, it, vi } from "vitest";
import { ShopifyAppKitProvider } from "./core";
import { useAppNavigation } from "./navigation";

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
