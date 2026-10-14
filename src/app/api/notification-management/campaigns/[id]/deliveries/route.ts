// Files: src/app/api/notification-management/campaigns/[id]/deliveries/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return createNotificationManagementController().getDeliveryReport(req, id);
}
