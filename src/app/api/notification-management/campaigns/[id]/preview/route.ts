import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/[id]/preview/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().previewAudience(req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "notification-management/campaigns/:id/preview",
);
