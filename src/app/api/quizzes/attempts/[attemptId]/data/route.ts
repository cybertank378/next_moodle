import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";
import type { RouteContext } from "@/core/http/routeUtils";

type AttemptRouteContext = RouteContext<{ attemptId: string }>;

export async function GET(
  req: NextRequest,
  context: AttemptRouteContext,
): Promise<NextResponse> {
  const { attemptId } = await context.params;
  return getQuizAttemptController().getData(attemptId, req);
}
