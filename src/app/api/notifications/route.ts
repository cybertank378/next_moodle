import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import { getNotificationController } from "@/app/api/notifications/_factory";

export async function GET(req: Request): Promise<Response> {
  return getNotificationController().getNotifications(req);
}

async function originalPATCH(req: Request): Promise<Response> {
  return getNotificationController().markAllAsRead(req);
}

export const PATCH = withAuditedMutation(originalPATCH, "notifications");
