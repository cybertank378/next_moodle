import "server-only";

import { getNotificationController } from "@/app/api/notifications/_factory";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
): Promise<Response> {
  const { id } = await params;
  return getNotificationController().markAsRead(id, req);
}
