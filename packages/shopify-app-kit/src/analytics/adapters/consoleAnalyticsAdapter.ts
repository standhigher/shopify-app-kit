import type { AnalyticsAdapter } from "../analytics-types";

export function consoleAnalyticsAdapter(logger: Pick<Console, "info"> = console): AnalyticsAdapter {
  return {
    track: (event) => {
      logger.info("[shopify-app-kit]", event);
    }
  };
}
