import "server-only";

import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { SecurityError } from "@/core/errors/SecurityError";
import { ValidationError } from "@/core/errors/ValidationError";
import { createLogger } from "@/core/logger/createLogger";
import type { Logger } from "@/core/logger/Logger";
import { SsrfValidator } from "@/core/security/SsrfValidator";
import { encodeMoodleParams } from "./MoodleEncoder";
import { MoodleErrorMapper } from "./MoodleErrorMapper";
import type {
  MoodleClient,
  MoodleCredentials,
  MoodleRequestOptions,
} from "./types";

const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_RETRY_DELAY_MS = 100;
const MAX_SAFE_READ_RETRIES = 2;
const RETRYABLE_HTTP_STATUSES = new Set([408, 429, 500, 502, 503, 504]);

function wait(milliseconds: number): Promise<void> {
  if (milliseconds <= 0) return Promise.resolve();
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

function isTimeout(error: unknown): boolean {
  return (
    error instanceof Error &&
    (error.name === "TimeoutError" || error.name === "AbortError")
  );
}

export class MoodleRestClient implements MoodleClient {
  private readonly endpoint: string;
  private readonly token: string;
  private readonly timeoutMs: number;
  private readonly logger: Logger;

  constructor(
    credentials: MoodleCredentials,
    ssrfValidator = new SsrfValidator(),
  ) {
    const rawBaseUrl = credentials.baseUrl.trim();
    const baseUrl = ssrfValidator.validateUrl(rawBaseUrl);

    if (baseUrl.protocol !== "https:") {
      throw new SecurityError("Moodle base URL must use HTTPS.");
    }
    if (baseUrl.username || baseUrl.password) {
      throw new SecurityError("Moodle base URL must not contain credentials.");
    }
    if (baseUrl.search || baseUrl.hash) {
      throw new ValidationError(
        "Moodle base URL must not contain a query string or fragment.",
      );
    }
    if (credentials.sslVerify === false) {
      throw new SecurityError(
        "Moodle TLS certificate verification is required.",
      );
    }
    if (!credentials.token.trim()) {
      throw new ValidationError("Moodle service token is required.");
    }

    const normalizedPath = baseUrl.pathname.replace(/\/+$/, "");
    baseUrl.pathname = `${normalizedPath}/webservice/rest/server.php`;
    this.endpoint = baseUrl.toString();
    this.token = credentials.token.trim();
    this.timeoutMs = credentials.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.logger = createLogger("MoodleRestClient");
  }

  async call<T = unknown>(
    wsfunction: string,
    params: Record<string, unknown> = {},
    options: MoodleRequestOptions = {},
  ): Promise<T> {
    const requestKind = options.requestKind ?? "mutation";
    const retries =
      requestKind === "safe-read"
        ? Math.min(Math.max(options.maxRetries ?? 0, 0), MAX_SAFE_READ_RETRIES)
        : 0;
    const requestLogger = options.requestId
      ? this.logger.child({ requestId: options.requestId })
      : this.logger;

    for (let attempt = 0; attempt <= retries; attempt += 1) {
      try {
        const response = await fetch(this.endpoint, {
          method: "POST",
          headers: {
            "content-type": "application/x-www-form-urlencoded",
            ...options.headers,
          },
          body: encodeMoodleParams({
            wstoken: this.token,
            moodlewsrestformat: "json",
            wsfunction,
            ...params,
          }),
          signal: AbortSignal.timeout(options.timeoutMs ?? this.timeoutMs),
        });

        if (!response.ok) {
          if (
            attempt < retries &&
            RETRYABLE_HTTP_STATUSES.has(response.status)
          ) {
            requestLogger.warn("Retrying safe Moodle read after HTTP failure", {
              wsfunction,
              status: response.status,
              attempt: attempt + 1,
            });
            await wait(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS);
            continue;
          }
          throw MoodleErrorMapper.fromHttpStatus(response.status);
        }

        let responseData: unknown;
        try {
          responseData = await response.json();
        } catch {
          throw new InfrastructureError(
            "Moodle returned an invalid response.",
            {
              wsfunction,
            },
          );
        }

        if (MoodleErrorMapper.isMoodleException(responseData)) {
          requestLogger.warn("Moodle returned a normalized upstream error", {
            wsfunction,
            moodleErrorCode: responseData.errorcode,
          });
          throw MoodleErrorMapper.fromMoodleException(responseData);
        }

        return responseData as T;
      } catch (error: unknown) {
        if (error instanceof InfrastructureError && !isTimeout(error)) {
          throw error;
        }
        if (
          error instanceof Error &&
          "isOperational" in error &&
          !isTimeout(error)
        ) {
          throw error;
        }

        if (attempt < retries) {
          requestLogger.warn(
            "Retrying safe Moodle read after transport failure",
            {
              wsfunction,
              attempt: attempt + 1,
            },
          );
          await wait(options.retryDelayMs ?? DEFAULT_RETRY_DELAY_MS);
          continue;
        }

        const timedOut = isTimeout(error);
        requestLogger.error(
          timedOut ? "Moodle request timed out" : "Moodle transport failed",
          undefined,
          { wsfunction },
        );
        throw new InfrastructureError(
          timedOut
            ? "Moodle request exceeded its timeout budget."
            : "Moodle transport request failed.",
          { wsfunction },
        );
      }
    }

    throw new InfrastructureError("Moodle transport request failed.");
  }
}
