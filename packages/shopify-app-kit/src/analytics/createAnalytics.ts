import type {
  AnalyticsClient,
  AppKitEvent,
  CreateAnalyticsOptions,
  ScalarAttribute
} from "./analytics-types";

function isScalar(value: unknown): value is ScalarAttribute {
  return (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  );
}

export function validateEvent(event: AppKitEvent): AppKitEvent {
  if (event.name === "billing_event" && !event.idempotencyKey) {
    throw new Error("billing_event requires idempotencyKey.");
  }

  for (const [key, value] of Object.entries(event.attributes ?? {})) {
    if (!isScalar(value)) {
      throw new Error(`Analytics attribute "${key}" must be a scalar value.`);
    }
  }

  return {
    ...event,
    timestamp: event.timestamp ?? new Date().toISOString()
  };
}

export function createAnalytics({
  adapters = [],
  onError
}: CreateAnalyticsOptions = {}): AnalyticsClient {
  return {
    async track(input) {
      const event = validateEvent(input);
      const errors: unknown[] = [];

      for (const adapter of adapters) {
        try {
          await adapter.track(event);
        } catch (error) {
          errors.push(error);
          onError?.(error, event, adapter);
        }
      }

      if (errors.length > 0) {
        throw new AggregateError(errors, "One or more analytics adapters failed.");
      }
    }
  };
}
