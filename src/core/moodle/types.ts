export interface MoodleCredentials {
  baseUrl: string;
  token: string;
  moodleUrl?: string;
  proctorToken?: string;
  timeoutMs?: number;
  sslVerify?: boolean;
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
