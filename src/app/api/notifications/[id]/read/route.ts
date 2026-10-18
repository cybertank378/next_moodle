import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getNotificationController } from "@/app/api/notifications/_factory";

async function originalPATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await params;
  return getNotificationController().markAsRead(id, req);
}

export const PATCH = withAuditedMutation(
  originalPATCH,
  "notifications/:id/read",
);
