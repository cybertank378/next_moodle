import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCourseController } from "@/app/api/courses/_factory";
import {
  type RouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

type CourseRouteContext = RouteContext<{ courseId: string }>;

export async function GET(
  _req: NextRequest,
  context: CourseRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();

  const { courseId } = await context.params;
  return getCourseController().getContents(actor, courseId);
}
