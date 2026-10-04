import "server-only";

import { getNotificationController } from "@/app/api/notifications/_factory";

export async function GET(req: Request): Promise<Response> {
  return getNotificationController().getNotifications(req);
}

export async function PATCH(req: Request): Promise<Response> {
  return getNotificationController().markAllAsRead(req);
}
