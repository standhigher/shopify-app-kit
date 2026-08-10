import type { AnalyticsAdapter } from "../analytics-types";

export function noopAnalyticsAdapter(): AnalyticsAdapter {
  return {
    track: () => undefined
  };
}
