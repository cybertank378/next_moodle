import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getScheduleController } from "@/app/api/schedule/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  return getScheduleController().getSchedule(
    session.actor,
    req,
    session.moodleToken,
  );
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  return getScheduleController().createSchedule(
    session.actor,
    req,
    session.moodleToken,
  );
}
