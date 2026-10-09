import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/[id]/retry/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

async function originalPOST(
  req: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  return createNotificationManagementController().retryDelivery(req, id);
}

export const POST = withAuditedMutation(originalPOST, "notification-management/campaigns/:id/retry");
