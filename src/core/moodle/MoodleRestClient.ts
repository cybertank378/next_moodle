import "server-only";
import { InfrastructureError } from "../errors/InfrastructureError";
import { createLogger, type ILogger } from "../logger";
import { MoodleErrorMapper } from "./MoodleErrorMapper";
import { isMoodleExceptionResponse } from "./types/MoodleExceptionResponse";
import type { MoodleRequestParameters } from "./types/MoodleRequestParameters";

export interface MoodleRestClientOptions {
  readonly baseUrl: string;
  readonly token: string;
  readonly timeoutMs?: number;
  readonly logger?: ILogger;
}

export interface MoodleCallOptions {
  readonly requestId?: string;
  readonly timeoutMs?: number;
}

export function encodeMoodleParams(
  params: Record<string, unknown>,
  prefix = "",
): URLSearchParams {
  const searchParams = new URLSearchParams();

  function append(data: unknown, currentPrefix: string): void {
    if (data === null || data === undefined) {
      return;
    }

    if (typeof data === "object" && !(data instanceof Date)) {
      if (Array.isArray(data)) {
        for (let i = 0; i < data.length; i++) {
          append(data[i], `${currentPrefix}[${i}]`);
        }
      } else {
        for (const [key, val] of Object.entries(
          data as Record<string, unknown>,
        )) {
          const newPrefix = currentPrefix ? `${currentPrefix}[${key}]` : key;
          append(val, newPrefix);
        }
      }
    } else {
      searchParams.append(currentPrefix, String(data));
    }
  }

  append(params, prefix);
  return searchParams;
}

export class MoodleRestClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly defaultTimeoutMs: number;
  private readonly logger: ILogger;

  constructor(options: MoodleRestClientOptions) {
    if (!options.baseUrl) {
      throw new Error("MoodleRestClient: baseUrl is required");
    }
    if (!options.token) {
      throw new Error("MoodleRestClient: token is required");
    }

    // Strip trailing slash
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.token = options.token;
    this.defaultTimeoutMs = options.timeoutMs ?? 10000;
    this.logger =
      options.logger ?? createLogger({ module: "MoodleRestClient" });
  }

  public async call<T>(
    wsfunction: string,
    params: MoodleRequestParameters = {},
    options: MoodleCallOptions = {},
  ): Promise<T> {
    const endpoint = `${this.baseUrl}/webservice/rest/server.php`;
    const timeoutMs = options.timeoutMs ?? this.defaultTimeoutMs;
    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);

    const callLogger = this.logger.child({
      requestId: options.requestId,
      wsfunction,
      endpoint,
    });

    const bodyParams = {
      wstoken: this.token,
      wsfunction,
      moodlewsrestformat: "json",
      ...params,
    };

    const encodedBody = encodeMoodleParams(bodyParams);

    callLogger.debug("Dispatching request to Moodle REST API", {
      paramKeys: Object.keys(params),
    });

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          ...(options.requestId ? { "X-Request-Id": options.requestId } : {}),
        },
        body: encodedBody.toString(),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new InfrastructureError(
          `Moodle returned HTTP status ${response.status}: ${response.statusText}`,
          { status: response.status },
        );
      }

      const rawData = await response.json();

      // Check for Moodle application-level exceptions (Moodle often returns 200 with exception payload)
      if (isMoodleExceptionResponse(rawData)) {
        callLogger.warn("Moodle returned exception response", {
          errorcode: rawData.errorcode,
          exception: rawData.exception,
        });
        throw MoodleErrorMapper.mapException(rawData);
      }

      return rawData as T;
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        callLogger.error("Moodle request timed out", error, { timeoutMs });
        throw new InfrastructureError(
          `Moodle request timed out after ${timeoutMs}ms`,
        );
      }

      if (
        error instanceof InfrastructureError ||
        (error as { moodleErrorCode?: string }).moodleErrorCode
      ) {
        throw error;
      }

      callLogger.error("Moodle REST invocation error", error);
      throw new InfrastructureError(
        `Failed to communicate with Moodle LMS: ${error instanceof Error ? error.message : String(error)}`,
      );
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
