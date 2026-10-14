import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCourseController } from "@/app/api/courses/_factory";
import type { RouteContext } from "@/core/http/routeUtils";

type CourseRouteContext = RouteContext<{ courseId: string }>;

export async function GET(
  req: NextRequest,
  context: CourseRouteContext,
): Promise<NextResponse> {
  const { courseId } = await context.params;
  return getCourseController().getDetail(req, courseId);
}
