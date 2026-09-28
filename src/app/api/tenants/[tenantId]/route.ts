import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenants/_factory";
import {
  type TenantRouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(
  _req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();
  const { tenantId } = await context.params;
  return getTenantsController().getOne(actor, tenantId);
}

export async function PATCH(
  req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();
  const { tenantId } = await context.params;
  return getTenantsController().update(actor, tenantId, req);
}

export async function DELETE(
  _req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();
  const { tenantId } = await context.params;
  return getTenantsController().remove(actor, tenantId);
}
