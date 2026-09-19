import { type NextRequest, NextResponse } from "next/server";
import type { CurrentActor } from "../auth/CurrentActor";
import { resolveCurrentActor } from "../auth/resolveCurrentActor";
import { AppError } from "../errors/AppError";
import { type ILogger, createLogger } from "../logger";
import { generateRequestId } from "../security/RequestId";
import type { TenantContext } from "../tenant/TenantContext";
import { resolveCurrentTenant } from "../tenant/resolveCurrentTenant";
import { createErrorResponse } from "./ApiErrorResponse";
import { createSuccessResponse } from "./ApiResponse";
import { HttpStatus } from "./HttpStatus";

export interface ApiHandlerContext {
  readonly requestId: string;
  readonly tenant: TenantContext;
  readonly actor: CurrentActor | null;
  readonly logger: ILogger;
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
    routeSegmentContext: { params: Promise<Record<string, string | string[] | undefined>> },
  ): Promise<NextResponse> => {
    const requestId = generateRequestId();
    const logger = createLogger({ requestId });

    try {
      const tenant = await resolveCurrentTenant(request);
      const actor = await resolveCurrentActor(request);

      if (options.requireAuth && !actor) {
        return NextResponse.json(
          createErrorResponse("UNAUTHORIZED", "Authentication required to access this resource"),
          { status: HttpStatus.UNAUTHORIZED },
        );
      }

      const contextualLogger = logger.child({
        tenantId: tenant.tenantId,
        actorId: actor?.id,
      });

      const resolvedParams = routeSegmentContext?.params
        ? ((await routeSegmentContext.params) as Record<string, string | string[]>)
        : {};

      const handlerContext: ApiHandlerContext = {
        requestId,
        tenant,
        actor,
        logger: contextualLogger,
        params: resolvedParams,
      };

      const result = await handler(request, handlerContext);

      // If handler returned a raw NextResponse (e.g. redirect or custom headers), return it
      if (result instanceof NextResponse) {
        result.headers.set("x-request-id", requestId);
        return result;
      }

      // Otherwise format as standard ApiResponse
      const response = NextResponse.json(createSuccessResponse(result), {
        status: HttpStatus.OK,
      });
      response.headers.set("x-request-id", requestId);
      return response;
    } catch (error) {
      if (error instanceof AppError) {
        logger.warn(`Handled application error: ${error.message}`, {
          code: error.code,
          statusCode: error.statusCode,
        });

        const response = NextResponse.json(
          createErrorResponse(error.code, error.message, error.details),
          { status: error.statusCode },
        );
        response.headers.set("x-request-id", requestId);
        return response;
      }

      logger.error("Unhandled API exception occurred", error);

      const response = NextResponse.json(
        createErrorResponse(
          "INTERNAL_SERVER_ERROR",
          "An unexpected server error occurred. Please try again later.",
        ),
        { status: HttpStatus.INTERNAL_SERVER_ERROR },
      );
      response.headers.set("x-request-id", requestId);
      return response;
    }
  };
}
