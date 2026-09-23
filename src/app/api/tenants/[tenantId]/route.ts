import "server-only";

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";
import { getTenantsController } from "@/app/api/tenants/_factory";

interface RouteContext {
  params: Promise<{ tenantId: string }>;
}

function unauthorized(): NextResponse {
  return NextResponse.json(
    ApiResponse.error(
      "UNAUTHORIZED",
      "Sesi tidak valid atau telah berakhir.",
      HttpStatus.UNAUTHORIZED,
    ).body,
    { status: HttpStatus.UNAUTHORIZED },
  );
}

export async function GET(
  _req: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorized();
  const { tenantId } = await context.params;
  return getTenantsController().getOne(actor, tenantId);
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorized();
  const { tenantId } = await context.params;
  return getTenantsController().update(actor, tenantId, req);
}

export async function DELETE(
  _req: NextRequest,
  context: RouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorized();
  const { tenantId } = await context.params;
  return getTenantsController().remove(actor, tenantId);
}
