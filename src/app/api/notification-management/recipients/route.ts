// Files: src/app/api/notification-management/recipients/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().getRecipientOptions(req);
}
