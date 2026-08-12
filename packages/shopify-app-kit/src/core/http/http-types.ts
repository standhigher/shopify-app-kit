export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export type FetchLike = (input: string | URL | Request, init?: RequestInit) => Promise<Response>;

export interface RetryContext {
  attempt: number;
  error?: unknown;
  method: HttpMethod;
  response?: Response;
}

export interface HttpClientOptions {
  fetch?: FetchLike;
  timeout?: number;
  retry?: number;
  headers?: HeadersInit;
  requestId?: () => string;
  retryDelay?: (context: RetryContext) => number;
}

export interface HttpRequestOptions extends Omit<RequestInit, "body" | "method"> {
  timeout?: number;
  retry?: number;
  requestId?: string;
}

export interface HttpClient {
  get<T>(url: string, options?: HttpRequestOptions): Promise<T>;
  post<T>(url: string, data?: unknown, options?: HttpRequestOptions): Promise<T>;
  put<T>(url: string, data?: unknown, options?: HttpRequestOptions): Promise<T>;
  delete<T>(url: string, options?: HttpRequestOptions): Promise<T>;
}
