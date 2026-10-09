import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizController } from "@/app/api/quizzes/_factory";
import {
  type RouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

type QuizRouteContext = RouteContext<{ quizId: string }>;

export async function GET(
  _req: NextRequest,
  context: QuizRouteContext,
): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();

  const { quizId } = await context.params;
  return getQuizController().getDetail(actor, quizId);
}
