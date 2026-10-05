// Files: src/app/api/notifications/devices/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function POST(req: Request): Promise<Response> {
  return createNotificationManagementController().registerDevice(req);
}

export async function DELETE(req: Request): Promise<Response> {
  return createNotificationManagementController().unregisterDevice(req);
}
