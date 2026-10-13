import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenant/_factory";
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

async function originalPATCH(
  req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();
  const { tenantId } = await context.params;
  return getTenantsController().update(actor, tenantId, req);
}

async function originalDELETE(
  _req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();
  const { tenantId } = await context.params;
  return getTenantsController().remove(actor, tenantId);
}

export const PATCH = withAuditedMutation(originalPATCH, "tenant/:id");
export const DELETE = withAuditedMutation(originalDELETE, "tenant/:id");
