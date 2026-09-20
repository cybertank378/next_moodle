import "server-only";
import { MoodleError } from "../errors/MoodleError";
import { createLogger, type ILogger } from "../logger";
import type { MoodleClientConfig } from "./MoodleClientConfig";
import { MoodleErrorMapper } from "./MoodleErrorMapper";
import {
  encodeMoodleParams,
  MoodleRequestEncoder,
} from "./MoodleRequestEncoder";
import { isMoodleExceptionResponse } from "./types/MoodleExceptionResponse";
import type { MoodleRequestParameters } from "./types/MoodleRequestParameters";

export type MoodleRestClientOptions = MoodleClientConfig;

export interface MoodleCallOptions {
  readonly requestId?: string;
  readonly timeoutMs?: number;
}

export { encodeMoodleParams };

export class MoodleRestClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly defaultTimeoutMs: number;
  private readonly logger: ILogger;
  private readonly defaultRequestId?: string;
  private readonly defaultTenantId?: string;
  private readonly fetcher: typeof fetch;

  constructor(options: MoodleClientConfig) {
    if (!options.baseUrl) {
      throw new Error("MoodleRestClient: baseUrl is required");
    }
    if (!options.token) {
      throw new Error("MoodleRestClient: token is required");
    }

    // Validate URL scheme for security
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(options.baseUrl);
    } catch {
      throw new Error(
        `MoodleRestClient: Invalid baseUrl provided "${options.baseUrl}"`,
      );
    }

    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      throw new Error(
        `MoodleRestClient: Invalid base URL scheme "${parsedUrl.protocol}". Only http: and https: are allowed.`,
      );
    }

    // Strip trailing slashes to normalize baseUrl
    this.baseUrl = options.baseUrl.replace(/\/+$/, "");
    this.token = options.token;
    this.defaultTimeoutMs = options.timeoutMs ?? 10_000;
    this.logger =
      options.logger ?? createLogger({ module: "MoodleRestClient" });
    this.defaultRequestId = options.requestId;
    this.defaultTenantId = options.tenantId;
    this.fetcher = options.fetcher ?? fetch;
  }

  public async call<T>(
    wsfunction: string,
    params?: MoodleRequestParameters,
    options?: MoodleCallOptions,
  ): Promise<T> {
    const endpoint = `${this.baseUrl}/webservice/rest/server.php`;
    const timeoutMs = options?.timeoutMs ?? this.defaultTimeoutMs;
    const requestId = options?.requestId ?? this.defaultRequestId;
    const tenantId = this.defaultTenantId;

    const controller = new AbortController();
    const timeoutHandle = setTimeout(() => controller.abort(), timeoutMs);
    const startTime = Date.now();

    const bodyParams = {
      wstoken: this.token,
      wsfunction,
      moodlewsrestformat: "json",
      ...(params ?? {}),
    };

    const encodedBody = MoodleRequestEncoder.encode(bodyParams);

    this.logger.debug("moodle_request_started", {
      wsfunction,
      requestId,
      tenantId,
    });

    try {
      const response = await this.fetcher(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          ...(requestId ? { "X-Request-Id": requestId } : {}),
        },
        body: encodedBody.toString(),
        signal: controller.signal,
      });

      const durationMs = Date.now() - startTime;

      if (!response.ok) {
        this.logger.warn("moodle_request_failed", {
          wsfunction,
          requestId,
          tenantId,
          durationMs,
          httpStatus: response.status,
          errorCode: `HTTP_${response.status}`,
        });
        throw MoodleErrorMapper.mapHttpError(
          response.status,
          response.statusText,
          { requestId, tenantId },
        );
      }

      const rawText = await response.text();
      let rawData: unknown;
      try {
        rawData = JSON.parse(rawText);
      } catch (parseError) {
        this.logger.error("moodle_request_failed", parseError, {
          wsfunction,
          requestId,
          tenantId,
          durationMs,
          httpStatus: response.status,
          errorCode: "INVALID_JSON",
        });
        throw MoodleErrorMapper.mapInvalidResponse(parseError, {
          requestId,
          tenantId,
        });
      }

      if (isMoodleExceptionResponse(rawData)) {
        this.logger.warn("moodle_request_failed", {
          wsfunction,
          requestId,
          tenantId,
          durationMs,
          httpStatus: response.status,
          errorCode: rawData.errorcode,
        });
        throw MoodleErrorMapper.mapException(rawData, {
          requestId,
          tenantId,
        });
      }

      this.logger.debug("moodle_request_completed", {
        wsfunction,
        requestId,
        tenantId,
        durationMs,
        httpStatus: response.status,
      });

      return rawData as T;
    } catch (error) {
      const durationMs = Date.now() - startTime;

      if (error instanceof Error && error.name === "AbortError") {
        this.logger.error("moodle_request_timeout", error, {
          wsfunction,
          requestId,
          tenantId,
          durationMs,
          timeoutMs,
        });
        throw MoodleErrorMapper.mapTimeoutError(timeoutMs, {
          requestId,
          tenantId,
        });
      }

      if (error instanceof MoodleError) {
        throw error;
      }

      this.logger.error("moodle_request_failed", error, {
        wsfunction,
        requestId,
        tenantId,
        durationMs,
        errorCode: "NETWORK_ERROR",
      });
      throw MoodleErrorMapper.mapNetworkError(error, {
        requestId,
        tenantId,
      });
    } finally {
      clearTimeout(timeoutHandle);
    }
  }
}
