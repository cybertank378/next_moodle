import { type NextRequest, NextResponse } from "next/server";
import type { CurrentActor } from "../auth/CurrentActor";
import { resolveCurrentActor } from "../auth/resolveCurrentActor";
import { createLogger, type Logger } from "../logger";
import { getOrGenerateRequestId } from "../security/RequestId";
import { resolveCurrentTenant } from "../tenant/resolveCurrentTenant";
import type { TenantContext } from "../tenant/TenantContext";
import { ApiResponse } from "./ApiResponse";
import { HttpStatus } from "./HttpStatus";
import { mapErrorToHttpResponse } from "./mapErrorToHttpResponse";

export interface ApiHandlerContext {
  readonly requestId: string;
  readonly tenant: TenantContext;
  readonly actor: CurrentActor | null;
  readonly logger: Logger;
  readonly params: Record<string, string | string[]>;
}

export type ApiRouteHandler<T = unknown> = (
  request: NextRequest,
  context: ApiHandlerContext,
) => Promise<T | NextResponse>;

export interface WithApiHandlerOptions {
  requireAuth?: boolean;
}

export function withApiHandler<T>(
  handler: ApiRouteHandler<T>,
  options: WithApiHandlerOptions = {},
) {
  return async (
    request: NextRequest,
    routeSegmentContext: {
      params: Promise<Record<string, string | string[] | undefined>>;
    } = {
      params: Promise.resolve({}),
    },
  ): Promise<NextResponse> => {
    const requestId = getOrGenerateRequestId(request);
    let logger: Logger = createLogger({ requestId });

    try {
      const tenant = await resolveCurrentTenant(request);

      let actor: CurrentActor | null = null;
      try {
        actor = await resolveCurrentActor(request, undefined, tenant);
      } catch (authErr) {
        if (options.requireAuth) {
          throw authErr;
        }
      }

      logger = logger.child({
        tenantId: tenant.tenantId,
        actorId: actor?.userId,
      });

      const resolvedParams = routeSegmentContext?.params
        ? ((await routeSegmentContext.params) as Record<
            string,
            string | string[]
          >)
        : {};

      const handlerContext: ApiHandlerContext = {
        requestId,
        tenant,
        actor,
        logger,
        params: resolvedParams,
      };

      const result = await handler(request, handlerContext);

      // If handler returned a raw NextResponse (e.g. redirect or custom headers), return it
      if (result instanceof NextResponse) {
        result.headers.set("x-request-id", requestId);
        return result;
      }

      // Format as standard ApiResponse.success
      const responseBody = ApiResponse.success(result);
      const response = NextResponse.json(responseBody, {
        status: HttpStatus.OK,
      });
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (error) {
      logger.error("API handler execution error", error, { requestId });

      const { status, body } = mapErrorToHttpResponse(error, requestId);
      const response = NextResponse.json(body, { status });
      response.headers.set("x-request-id", requestId);
      return response;
    }
  };
}
