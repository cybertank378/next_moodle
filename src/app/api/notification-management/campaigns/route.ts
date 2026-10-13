import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(req: Request): Promise<Response> {
  return createNotificationManagementController().listCampaigns(req);
}

async function originalPOST(req: Request): Promise<Response> {
  return createNotificationManagementController().createCampaign(req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "notification-management/campaigns",
);
