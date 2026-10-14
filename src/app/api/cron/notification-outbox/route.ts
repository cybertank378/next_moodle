import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { getNotificationOutboxCronController } from "@/app/api/cron/notification-outbox/_factory";

export async function POST(request: NextRequest): Promise<NextResponse> {
  return getNotificationOutboxCronController().process(request);
}
