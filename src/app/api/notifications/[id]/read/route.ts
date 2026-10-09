import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import { getNotificationController } from "@/app/api/notifications/_factory";

async function originalPATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  return getNotificationController().markAsRead(id, req);
}

export const PATCH = withAuditedMutation(
  originalPATCH,
  "notifications/:id/read",
);
