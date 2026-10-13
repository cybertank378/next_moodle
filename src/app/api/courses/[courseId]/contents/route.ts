import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCourseController } from "@/app/api/courses/_factory";
import {
  type RouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

type CourseRouteContext = RouteContext<{ courseId: string }>;

export async function GET(
  _req: NextRequest,
  context: CourseRouteContext,
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) return unauthorizedResponse();

  const { courseId } = await context.params;
  return getCourseController().getContents(
    session.actor,
    courseId,
    session.moodleToken,
  );
}
