import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().listCampaigns(req);
}

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().createCampaign(req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "notification-management/campaigns",
);
