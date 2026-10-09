import { AppError } from "@/core/errors/AppError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import { createLogger } from "@/core/logger/createLogger";
import type { Logger } from "@/core/logger/Logger";
import {
  getRateLimiter,
  type RateLimitScope,
  resolveRateLimitKey,
} from "@/core/security/RateLimitConfig";
import { resolveRequestId } from "@/core/security/RequestId";

export interface ApiHandlerContext {
  requestId: string;
  logger: Logger;
  params?:
    | Promise<Record<string, string | string[]>>
    | Record<string, string | string[]>;
}

export interface ApiHandlerOptions {
  /** Which rate-limit scope to apply. Defaults to "default". Set to "none" to skip. */
  rateLimitScope?: RateLimitScope;
}

export type ApiRouteHandler<T = unknown> = (
  req: Request,
  ctx: ApiHandlerContext,
) => Promise<T | ApiResponse<T>> | T | ApiResponse<T>;

export function withApiHandler<T = unknown>(
  handler: ApiRouteHandler<T>,
  options: ApiHandlerOptions = {},
) {
  const scope = options.rateLimitScope ?? "default";

  return async (
    req: Request,
    routeParams?: {
      params?:
        | Promise<Record<string, string | string[]>>
        | Record<string, string | string[]>;
    },
  ): Promise<Response> => {
    const requestId = resolveRequestId(req);
    const logger = createLogger("ApiHandler", { requestId });

    // ── Rate limiting ──────────────────────────────────────────────
    if (scope !== "none") {
      const key = resolveRateLimitKey(req);
      const limiter = getRateLimiter(scope);
      const result = await limiter.limit(key);

      if (!result.success) {
        const retryAfterSec = Math.ceil((result.resetAt - Date.now()) / 1_000);
        logger.warn("Rate limit exceeded", {
          key,
          scope,
          retryAfterSec,
        });
        return Response.json(
          {
            success: false,
            error: {
              code: "RATE_LIMITED",
              message:
                "Terlalu banyak permintaan, silakan coba beberapa saat lagi.",
            },
          },
          {
            status: 429,
            headers: {
              "x-request-id": requestId,
              "retry-after": String(retryAfterSec),
              "x-ratelimit-limit": String(result.limit),
              "x-ratelimit-remaining": "0",
              "x-ratelimit-reset": String(result.resetAt),
              "content-type": "application/json",
            },
          },
        );
      }
    }

    const context: ApiHandlerContext = {
      requestId,
      logger,
      params: routeParams?.params,
    };

    try {
      const result = await handler(req, context);

      const apiResponse: ApiResponse<unknown> =
        result instanceof ApiResponse
          ? result
          : ApiResponse.success(result, { requestId });

      return Response.json(apiResponse.body, {
        status: apiResponse.status,
        headers: {
          "x-request-id": requestId,
          "content-type": "application/json",
        },
      });
    } catch (error) {
      if (error instanceof AppError && error.isOperational) {
        logger.warn(`Operational request error: ${error.message}`, {
          code: error.code,
          statusCode: error.statusCode,
        });
      } else {
        logger.error("API handler execution failed", error);
      }
      const apiResponse = mapErrorToHttpResponse(error, requestId);

      return Response.json(apiResponse.body, {
        status: apiResponse.status,
        headers: {
          "x-request-id": requestId,
          "content-type": "application/json",
        },
      });
    }
  };
}
