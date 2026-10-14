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

  const { searchParams } = new URL(req.url);
  const courseIdParam = searchParams.get("courseId");
  const courseId = courseIdParam ? parseInt(courseIdParam, 10) : undefined;
  const status = searchParams.get("status") || undefined;
  const search = searchParams.get("search") || undefined;

  return getAssignmentController().getStudentAssignments({
    actor: session.actor,
    query: {
      courseId,
      status: status as any,
      search,
    },
    moodleToken: session.moodleToken,
  }) as unknown as NextResponse;
}
