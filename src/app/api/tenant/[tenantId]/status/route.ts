import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenant/_factory";
import {
  type TenantRouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

async function originalPATCH(
  req: NextRequest,
  context: TenantRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();

  const { tenantId } = await context.params;
  return getTenantsController().updateStatus(actor, tenantId, req);
}

export const PATCH = withAuditedMutation(originalPATCH, "tenant/:id/status");
