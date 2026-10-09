import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getUserController } from "@/app/api/users/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor ? getUserController().list(actor, req) : unauthorizedResponse();
}

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getUserController().create(actor, req)
    : unauthorizedResponse();
}

export const POST = withAuditedMutation(originalPOST, "users");
