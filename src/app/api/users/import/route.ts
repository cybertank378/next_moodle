import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getUserController } from "@/app/api/users/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getUserController().import(actor, req)
    : unauthorizedResponse();
}

export const POST = withAuditedMutation(originalPOST, "users/import");
