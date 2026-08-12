import { ApiError, isBackendEnvelope, isSuccessEnvelope, normalizeError } from "../error";
import type {
  FetchLike,
  HttpClient,
  HttpClientOptions,
  HttpMethod,
  HttpRequestOptions
} from "./http-types";

const DEFAULT_TIMEOUT = 15000;
const DEFAULT_RETRY = 1;
const RETRYABLE_STATUS = 500;

function defaultRequestId() {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

function resolveFetch(fetchLike?: FetchLike): FetchLike {
  const candidate = fetchLike ?? globalThis.fetch;
  if (!candidate) {
    throw new Error("A fetch implementation is required.");
  }

  return candidate.bind(globalThis) as FetchLike;
}

function mergeHeaders(...headers: Array<HeadersInit | undefined>) {
  const merged = new Headers();

  for (const source of headers) {
    if (!source) {
      continue;
    }

    new Headers(source).forEach((value, key) => {
      merged.set(key, value);
    });
  }

  return merged;
}

function isRetryableMethod(method: HttpMethod) {
  return method === "GET";
}

function isRetryableStatus(response: Response) {
  return response.status >= RETRYABLE_STATUS;
}

function isTimeoutError(error: unknown) {
  return error instanceof DOMException && error.name === "AbortError";
}

function shouldRetryError(method: HttpMethod, error: unknown) {
  return isRetryableMethod(method) && (isTimeoutError(error) || error instanceof Error);
}

async function parseResponseBody(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return response.json() as Promise<unknown>;
  }

  const text = await response.text();
  return text ? text : undefined;
}

function createBody(data: unknown, headers: Headers) {
  if (data === undefined) {
    return undefined;
  }

  if (
    typeof data === "string" ||
    data instanceof Blob ||
    data instanceof FormData ||
    data instanceof URLSearchParams ||
    data instanceof ArrayBuffer
  ) {
    return data;
  }

  if (!headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return JSON.stringify(data);
}

async function wait(ms: number) {
  if (ms <= 0) {
    return;
  }

  await new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function createHttpClient(options: HttpClientOptions = {}): HttpClient {
  const fetchLike = resolveFetch(options.fetch);
  const requestIdFactory = options.requestId ?? defaultRequestId;

  async function request<T>(
    method: HttpMethod,
    url: string,
    data?: unknown,
    requestOptions: HttpRequestOptions = {}
  ): Promise<T> {
    const timeout = requestOptions.timeout ?? options.timeout ?? DEFAULT_TIMEOUT;
    const retry = requestOptions.retry ?? options.retry ?? DEFAULT_RETRY;
    const requestId = requestOptions.requestId ?? requestIdFactory();
    let attempt = 0;

    while (true) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      const headers = mergeHeaders(options.headers, requestOptions.headers, {
        "x-request-id": requestId
      });

      try {
        const response = await fetchLike(url, {
          ...requestOptions,
          method,
          headers,
          body: createBody(data, headers),
          signal: controller.signal
        });
        const body = await parseResponseBody(response);

        if (!response.ok) {
          if (attempt < retry && isRetryableMethod(method) && isRetryableStatus(response)) {
            attempt += 1;
            await wait(options.retryDelay?.({ attempt, method, response }) ?? 0);
            continue;
          }

          throw normalizeError(
            isBackendEnvelope(body)
              ? body
              : {
                  code: "HTTP_ERROR",
                  message: response.statusText || "HTTP request failed",
                  details: body
                },
            {
              status: response.status,
              requestId: isBackendEnvelope(body) ? body.traceId : requestId
            }
          );
        }

        if (isSuccessEnvelope(body)) {
          return body.data as T;
        }

        if (isBackendEnvelope(body)) {
          throw normalizeError(body, { status: response.status });
        }

        return body as T;
      } catch (error) {
        if (error instanceof ApiError) {
          throw error;
        }

        const normalized = normalizeError(error, {
          requestId
        });

        if (attempt < retry && shouldRetryError(method, error)) {
          attempt += 1;
          await wait(options.retryDelay?.({ attempt, error, method }) ?? 0);
          continue;
        }

        throw normalized;
      } finally {
        clearTimeout(timeoutId);
      }
    }
  }

  const client: HttpClient = {
    get: <T>(url: string, requestOptions?: HttpRequestOptions) =>
      request<T>("GET", url, undefined, requestOptions),
    post: <T>(url: string, data?: unknown, requestOptions?: HttpRequestOptions) =>
      request<T>("POST", url, data, requestOptions),
    put: <T>(url: string, data?: unknown, requestOptions?: HttpRequestOptions) =>
      request<T>("PUT", url, data, requestOptions),
    delete: <T>(url: string, requestOptions?: HttpRequestOptions) =>
      request<T>("DELETE", url, undefined, requestOptions)
  };

  return client;
}

export const http = createHttpClient();
