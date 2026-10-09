// Files: src/app/api/notification-management/campaigns/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(req: Request): Promise<Response> {
  return createNotificationManagementController().listCampaigns(req);
}

export async function POST(req: Request): Promise<Response> {
  return createNotificationManagementController().createCampaign(req);
}
