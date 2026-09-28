import "server-only";

import { NextResponse } from "next/server";
import { ApiResponse } from "./ApiResponse";
import { HttpStatus } from "./HttpStatus";

/**
 * Standard Next.js App Router dynamic route context.
 */
export interface RouteContext<TParams = Record<string, string>> {
  params: Promise<TParams>;
}

/**
 * Context specifically for routes parameterized with [tenantId].
 */
export type TenantRouteContext = RouteContext<{ tenantId: string }>;

/**
 * Generates a standardized 401 Unauthorized HTTP response envelope.
 */
export function unauthorizedResponse(
  message = "Sesi tidak valid atau telah berakhir.",
): NextResponse {
  return NextResponse.json(
    ApiResponse.error("UNAUTHORIZED", message, HttpStatus.UNAUTHORIZED).body,
    { status: HttpStatus.UNAUTHORIZED },
  );
}

/**
 * Generates a standardized 403 Forbidden HTTP response envelope.
 */
export function forbiddenResponse(
  message = "Anda tidak memiliki akses ke resource ini.",
): NextResponse {
  return NextResponse.json(
    ApiResponse.error("FORBIDDEN", message, HttpStatus.FORBIDDEN).body,
    { status: HttpStatus.FORBIDDEN },
  );
}
