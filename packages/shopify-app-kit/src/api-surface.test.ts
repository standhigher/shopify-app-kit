import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import * as root from "@standhigher/shopify-app-kit";
import * as core from "@standhigher/shopify-app-kit/core";
import * as error from "@standhigher/shopify-app-kit/error";
import * as http from "@standhigher/shopify-app-kit/http";
import * as feedback from "@standhigher/shopify-app-kit/feedback";
import * as saveFlow from "@standhigher/shopify-app-kit/save-flow";
import * as navigation from "@standhigher/shopify-app-kit/navigation";
import * as picker from "@standhigher/shopify-app-kit/resource-picker";
import * as analytics from "@standhigher/shopify-app-kit/analytics";
import * as shopifyAdapters from "@standhigher/shopify-app-kit/shopify-adapters";

const packageJson = JSON.parse(
  readFileSync(resolve(import.meta.dirname, "../package.json"), "utf8")
) as { version: string; peerDependencies?: Record<string, string> };

describe("1.0 public API surface", () => {
  it("declares the stable package version and Polaris peer contract", () => {
    expect(packageJson.version).toBe("1.0.3");
    expect(packageJson.peerDependencies?.["@shopify/polaris"]).toBe("^13.9.5");
  });

  it("keeps every supported public subpath runtime entry available", () => {
    expect(root.ShopifyAppKitProvider).toEqual(expect.any(Function));
    expect(core.ShopifyAppKitProvider).toEqual(expect.any(Function));
    expect(error.ApiError).toEqual(expect.any(Function));
    expect(http.createHttpClient).toEqual(expect.any(Function));
    expect(feedback.AppModal).toEqual(expect.any(Function));
    expect(saveFlow.useDirtyForm).toEqual(expect.any(Function));
    expect(navigation.useAppNavigation).toEqual(expect.any(Function));
    expect(picker.useProductPicker).toEqual(expect.any(Function));
    expect(analytics.createAnalytics).toEqual(expect.any(Function));
    expect(shopifyAdapters.createShopifySaveBarAdapter).toEqual(expect.any(Function));
  });
});
