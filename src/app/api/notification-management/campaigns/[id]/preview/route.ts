// Files: src/app/api/notification-management/campaigns/[id]/preview/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function POST(req: Request): Promise<Response> {
  return createNotificationManagementController().previewAudience(req);
}
