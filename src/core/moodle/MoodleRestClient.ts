import "server-only";

import { InfrastructureError } from "@/core/errors";
import { createLogger, type Logger } from "@/core/logger";
import { encodeMoodleParams } from "./MoodleEncoder";
import { MoodleErrorMapper } from "./MoodleErrorMapper";
import type {
  MoodleClient,
  MoodleCredentials,
  MoodleRequestOptions,
} from "./types";

const DEFAULT_TIMEOUT_MS = 10000;

export class MoodleRestClient implements MoodleClient {
  private readonly baseUrl: string;
  private readonly token: string;
  private readonly logger: Logger;
  constructor(credentials: MoodleCredentials) {
    this.baseUrl = (credentials.baseUrl || credentials.moodleUrl || "")
      .trim()
      .replace(/\/+$/, "");
    this.token = credentials.token.trim();
    this.logger = createLogger("MoodleRestClient");
  }

  async call<T = unknown>(
    wsfunction: string,
    params: Record<string, unknown> = {},
    options: MoodleRequestOptions = {},
  ): Promise<T> {
    const { requestId, timeoutMs = DEFAULT_TIMEOUT_MS, headers = {} } = options;
    const requestLogger = requestId
      ? this.logger.child({ requestId })
      : this.logger;

    const endpoint = `${this.baseUrl}/webservice/rest/server.php`;

    // Combine standard Moodle REST parameters
    const payload = {
      wstoken: this.token,
      moodlewsrestformat: "json",
      wsfunction,
      ...params,
    };

    const encodedBody = encodeMoodleParams(payload);

    requestLogger.debug("Executing Moodle REST call", {
      wsfunction,
      endpoint,
    });

    let response: Response;
    const signal = AbortSignal.timeout(timeoutMs);

    try {
      response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          ...headers,
        },
        body: encodedBody,
        signal,
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        (error.name === "TimeoutError" || error.name === "AbortError")
      ) {
        requestLogger.error("Moodle request timed out", error, {
          wsfunction,
          timeoutMs,
        });
        throw new InfrastructureError(
          `Moodle request to ${wsfunction} timed out after ${timeoutMs}ms`,
          { wsfunction, timeoutMs },
        );
      }

      requestLogger.error("Moodle network error", error, { wsfunction });
      throw new InfrastructureError(
        `Failed to reach Moodle server: ${error instanceof Error ? error.message : String(error)}`,
        { wsfunction },
      );
    }

    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      requestLogger.error("Moodle HTTP non-200 response", undefined, {
        wsfunction,
        status: response.status,
      });
      throw MoodleErrorMapper.fromHttpStatus(response.status, errorText);
    }

    let responseData: unknown;
    try {
      responseData = await response.json();
    } catch (jsonErr) {
      requestLogger.error("Failed to parse Moodle JSON response", jsonErr, {
        wsfunction,
      });
      throw new InfrastructureError(
        `Invalid JSON returned by Moodle for ${wsfunction}`,
        { wsfunction },
      );
    }

    if (MoodleErrorMapper.isMoodleException(responseData)) {
      const mappedError = MoodleErrorMapper.fromMoodleException(responseData);
      requestLogger.warn("Moodle returned upstream exception", {
        wsfunction,
        moodleErrorCode: responseData.errorcode,
        exception: responseData.exception,
      });
      throw mappedError;
    }

    return responseData as T;
  }
}
