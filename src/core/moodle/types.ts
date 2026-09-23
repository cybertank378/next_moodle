export interface MoodleCredentials {
  baseUrl: string;
  token: string;
  /** @deprecated Use baseUrl. Kept while the legacy tenant module is retired. */
  moodleUrl?: string;
  /** @deprecated Resolve one server-side service token per client instead. */
  proctorToken?: string;
  timeoutMs?: number;
  sslVerify?: boolean;
}

export type MoodleRequestKind = "safe-read" | "mutation";

export interface MoodleRequestOptions {
  requestId?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
  requestKind?: MoodleRequestKind;
  maxRetries?: number;
  retryDelayMs?: number;
}

export interface MoodleRawException {
  exception?: string;
  errorcode?: string;
  message?: string;
  debuginfo?: string;
}

export interface MoodleClient {
  call<T = unknown>(
    wsfunction: string,
    params?: Record<string, unknown>,
    options?: MoodleRequestOptions,
  ): Promise<T>;
}
