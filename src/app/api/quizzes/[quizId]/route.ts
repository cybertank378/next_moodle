import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizController } from "@/app/api/quizzes/_factory";
import type { RouteContext } from "@/core/http/routeUtils";

type QuizRouteContext = RouteContext<{ quizId: string }>;

export async function GET(
  _req: NextRequest,
  context: QuizRouteContext,
): Promise<NextResponse> {
  const { quizId } = await context.params;
  return getQuizController().getDetail(quizId);
}
