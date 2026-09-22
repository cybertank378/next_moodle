import { AppError } from "@/core/errors/AppError";
import { createLogger } from "@/core/logger/createLogger";
import type { Logger } from "@/core/logger/Logger";
import { resolveRequestId } from "@/core/security/RequestId";
import { ApiResponse } from "./ApiResponse";
import { mapErrorToHttpResponse } from "./mapErrorToHttpResponse";

export interface ApiHandlerContext {
  requestId: string;
  logger: Logger;
  params?:
    | Promise<Record<string, string | string[]>>
    | Record<string, string | string[]>;
}

export type ApiRouteHandler<T = unknown> = (
  req: Request,
  ctx: ApiHandlerContext,
) => Promise<T | ApiResponse<T>> | T | ApiResponse<T>;

export function withApiHandler<T = unknown>(handler: ApiRouteHandler<T>) {
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
