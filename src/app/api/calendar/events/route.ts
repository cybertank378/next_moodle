import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCalendarController } from "@/app/api/calendar/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getCalendarController().getEvents(req);
}
