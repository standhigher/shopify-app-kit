import { describe, expect, it, vi } from "vitest";
import {
  createShopifyNavigationAdapter,
  createShopifyResourcePickerAdapter,
  createShopifySaveBarAdapter
} from "@standhigher/shopify-app-kit/shopify-adapters";

describe("Shopify App Bridge adapters", () => {
  it("is safe to import and create adapters during SSR", () => {
    vi.stubGlobal("window", undefined);
    expect(createShopifyNavigationAdapter()).toBeUndefined();
    expect(createShopifyResourcePickerAdapter()).toBeUndefined();
    expect(createShopifySaveBarAdapter()).toBeUndefined();
    vi.unstubAllGlobals();
  });

  it("returns undefined when the host does not expose a capability", () => {
    (window as Window & { shopify?: unknown }).shopify = {};
    expect(createShopifyNavigationAdapter()).toBeUndefined();
    expect(createShopifyResourcePickerAdapter()).toBeUndefined();
    expect(createShopifySaveBarAdapter()).toBeUndefined();
    delete (window as Window & { shopify?: unknown }).shopify;
  });

  it("preserves an explicit picker cancellation", async () => {
    (window as Window & { shopify?: unknown }).shopify = {
      resourcePicker: vi.fn().mockResolvedValue({ canceled: true, selection: [] })
    };
    const adapter = createShopifyResourcePickerAdapter();
    await expect(adapter?.openProductPicker?.()).resolves.toEqual({ canceled: true, selection: [] });
    delete (window as Window & { shopify?: unknown }).shopify;
  });
});
