export type ScalarAttribute = string | number | boolean | null;

export interface AppKitEvent {
  name: string;
  attributes?: Record<string, ScalarAttribute>;
  idempotencyKey?: string;
  timestamp?: string;
}

export interface AnalyticsAdapter {
  track: (event: AppKitEvent) => Promise<void> | void;
}

export interface AnalyticsClient {
  track: (event: AppKitEvent) => Promise<void>;
}

export interface CreateAnalyticsOptions {
  adapters?: AnalyticsAdapter[];
  onError?: (error: unknown, event: AppKitEvent, adapter: AnalyticsAdapter) => void;
}
