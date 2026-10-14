import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getAssignmentController } from "@/app/api/assignments/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  return getAssignmentController().getStudentAssignments(
    session.actor,
    req,
    session.moodleToken,
  );
}
