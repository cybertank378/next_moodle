import { resolveRequestId } from "../security/RequestId";
import { ApiResponse } from "./ApiResponse";
import { mapErrorToHttpResponse } from "./mapErrorToHttpResponse";

export interface ApiHandlerContext {
  requestId: string;
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
    const context: ApiHandlerContext = {
      requestId,
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
