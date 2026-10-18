import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getAuthController } from "@/app/api/auth/_factory";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return getAuthController().logout(req);
}

export const POST = withAuditedMutation(originalPOST, "auth/logout");
