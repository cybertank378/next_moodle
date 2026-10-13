import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getTenantsController } from "@/app/api/tenant/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getTenantsController().list(actor, req)
    : unauthorizedResponse();
}

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getTenantsController().create(actor, req)
    : unauthorizedResponse();
}

export const POST = withAuditedMutation(originalPOST, "tenant");
