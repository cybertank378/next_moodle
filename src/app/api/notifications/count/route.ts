import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getNotificationController } from "@/app/api/notifications/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getNotificationController().getUnreadCount(req);
}
