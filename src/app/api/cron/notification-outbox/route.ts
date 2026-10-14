import "server-only";
import { getNotificationOutboxCronController } from "@/app/api/cron/notification-outbox/_factory";

export async function POST(request: Request): Promise<Response> {
  return getNotificationOutboxCronController().process(request);
}
