import type { ApiErrorPayload } from "./error-types";

export class ApiError extends Error implements ApiErrorPayload {
  readonly code: string;
  readonly status?: number;
  readonly requestId?: string;
  readonly details?: unknown;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.code = payload.code;
    this.status = payload.status;
    this.requestId = payload.requestId;
    this.details = payload.details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}
