import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notifications/devices/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

async function originalPOST(req: Request): Promise<Response> {
  return createNotificationManagementController().registerDevice(req);
}

async function originalDELETE(req: Request): Promise<Response> {
  return createNotificationManagementController().unregisterDevice(req);
}

export const POST = withAuditedMutation(originalPOST, "notifications/devices");
export const DELETE = withAuditedMutation(
  originalDELETE,
  "notifications/devices",
);
