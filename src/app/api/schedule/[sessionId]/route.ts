import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getScheduleController } from "@/app/api/schedule/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ sessionId: string }> },
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { sessionId } = await context.params;

  return getScheduleController().getSessionDetail(
    session.actor,
    sessionId,
    session.moodleToken,
  );
}
