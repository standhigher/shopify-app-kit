export interface ApiErrorPayload {
  code: string;
  message: string;
  status?: number;
  requestId?: string;
  details?: unknown;
}

export interface BackendEnvelope<T = unknown> {
  code: string;
  message: string;
  data: T;
  traceId: string;
  details?: unknown;
}
