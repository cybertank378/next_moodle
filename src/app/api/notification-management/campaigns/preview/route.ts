// Files: src/app/api/notification-management/campaigns/preview/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPOST(req: Request): Promise<Response> {
  return createNotificationManagementController().previewAudience(req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "notification-management/campaigns/preview",
);
