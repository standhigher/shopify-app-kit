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
import type { AnalyticsClient } from "@standhigher/shopify-app-kit/analytics";
import type {
  ShopifyAppKitProviderProps,
  ShopifyAppKitContextValue
} from "@standhigher/shopify-app-kit/core";
import type { ApiErrorPayload, BackendEnvelope } from "@standhigher/shopify-app-kit/error";
import type { HttpClient, HttpRequestOptions } from "@standhigher/shopify-app-kit/http";
import type { AppBannerProps } from "@standhigher/shopify-app-kit/feedback";
import type { AppSaveBarProps, UseDirtyFormOptions } from "@standhigher/shopify-app-kit/save-flow";
import type { AppNavigation } from "@standhigher/shopify-app-kit/navigation";
import type { PickerResult } from "@standhigher/shopify-app-kit/resource-picker";

type PublicTypes = [
  AnalyticsClient,
  ShopifyAppKitProviderProps,
  ShopifyAppKitContextValue,
  ApiErrorPayload,
  BackendEnvelope,
  HttpClient,
  HttpRequestOptions,
  AppBannerProps,
  AppSaveBarProps,
  UseDirtyFormOptions<unknown>,
  AppNavigation,
  PickerResult
];

type AssertPublicTypes = PublicTypes extends unknown[] ? true : false;
const publicTypesAreImportable: AssertPublicTypes = true;
void publicTypesAreImportable;

describe("public API", () => {
  it("exposes the supported root and subpath runtime APIs", () => {
    expect(root.ShopifyAppKitProvider).toEqual(expect.any(Function));
    expect(core.ShopifyAppKitProvider).toEqual(expect.any(Function));
    expect(core.useAnalytics).toEqual(expect.any(Function));
    expect(error.ApiError).toEqual(expect.any(Function));
    expect(http.createHttpClient).toEqual(expect.any(Function));
    expect(feedback.ToastProvider).toEqual(expect.any(Function));
    expect(saveFlow.useDirtyForm).toEqual(expect.any(Function));
    expect(navigation.useAppNavigation).toEqual(expect.any(Function));
    expect(picker.useProductPicker).toEqual(expect.any(Function));
    expect(analytics.initAnalytics).toEqual(expect.any(Function));
  });
});
