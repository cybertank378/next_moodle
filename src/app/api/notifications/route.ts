import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getNotificationController } from "@/app/api/notifications/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getNotificationController().getNotifications(req);
}

async function originalPATCH(req: NextRequest): Promise<NextResponse> {
  return getNotificationController().markAllAsRead(req);
}

export const PATCH = withAuditedMutation(originalPATCH, "notifications");
