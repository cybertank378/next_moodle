export interface MoodleCredentials {
  baseUrl: string;
  token: string;
}

export interface MoodleRequestOptions {
  requestId?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
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
