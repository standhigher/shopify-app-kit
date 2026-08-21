import { createAnalytics } from "./createAnalytics";
import type {
  AnalyticsClient,
  AppKitEvent,
  CreateAnalyticsOptions
} from "./analytics-types";

const uninitializedMessage =
  "Analytics has not been initialized. Call initAnalytics(...) before tracking events.";

let currentAnalytics: AnalyticsClient | undefined;
let warnedUninitialized = false;

function isDevelopmentRuntime(): boolean {
  return typeof process !== "undefined" && process.env?.NODE_ENV === "development";
}

function warnUninitializedOnce(): void {
  if (warnedUninitialized || !isDevelopmentRuntime()) {
    return;
  }

  warnedUninitialized = true;
  console.warn(uninitializedMessage);
}

export const analytics: AnalyticsClient = {
  async track(event: AppKitEvent) {
    if (!currentAnalytics) {
      warnUninitializedOnce();
      return;
    }

    await currentAnalytics.track(event);
  }
};

export function initAnalytics(options: CreateAnalyticsOptions = {}): AnalyticsClient {
  currentAnalytics = createAnalytics(options);
  warnedUninitialized = false;
  return currentAnalytics;
}

export function getAnalytics(): AnalyticsClient {
  return currentAnalytics ?? analytics;
}

export function resetAnalytics(): void {
  currentAnalytics = undefined;
  warnedUninitialized = false;
}
