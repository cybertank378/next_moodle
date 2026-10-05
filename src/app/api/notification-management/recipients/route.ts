// Files: src/app/api/notification-management/recipients/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(req: Request): Promise<Response> {
  return createNotificationManagementController().getRecipientOptions(req);
}
