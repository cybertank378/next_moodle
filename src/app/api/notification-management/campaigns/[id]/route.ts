import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/[id]/route.ts
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return createNotificationManagementController().getCampaign(req, id);
}

async function originalPATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return createNotificationManagementController().updateCampaign(req, id);
}

async function originalDELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return createNotificationManagementController().deleteDraft(req, id);
}

export const PATCH = withAuditedMutation(
  originalPATCH,
  "notification-management/campaigns/:id",
);
export const DELETE = withAuditedMutation(
  originalDELETE,
  "notification-management/campaigns/:id",
);
