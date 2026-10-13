import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCalendarController } from "@/app/api/calendar/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  return getCalendarController().getEvents(
    session.actor,
    req,
    session.moodleToken,
  );
}
