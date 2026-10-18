import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notifications/devices/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().registerDevice(req);
}

async function originalDELETE(req: NextRequest): Promise<NextResponse> {
  return createNotificationManagementController().unregisterDevice(req);
}

export const POST = withAuditedMutation(originalPOST, "notifications/devices");
export const DELETE = withAuditedMutation(
  originalDELETE,
  "notifications/devices",
);
