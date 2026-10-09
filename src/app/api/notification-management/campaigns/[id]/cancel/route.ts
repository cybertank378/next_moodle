// Files: src/app/api/notification-management/campaigns/[id]/cancel/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function POST(
  req: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  return createNotificationManagementController().cancelCampaign(req, id);
}
