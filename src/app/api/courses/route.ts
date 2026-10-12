import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCourseController } from "@/app/api/courses/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  return session
    ? getCourseController().list(session.actor, req, session.moodleToken)
    : unauthorizedResponse();
}
