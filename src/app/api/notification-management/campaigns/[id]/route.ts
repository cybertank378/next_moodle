import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/notification-management/campaigns/[id]/route.ts
import "server-only";

import { createNotificationManagementController } from "@/app/api/notification-management/_factory";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  return createNotificationManagementController().getCampaign(req, id);
}

async function originalPATCH(
  req: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await context.params;
  return createNotificationManagementController().updateCampaign(req, id);
}

async function originalDELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
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
