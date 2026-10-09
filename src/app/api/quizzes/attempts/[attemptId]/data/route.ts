import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";
import {
  type RouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

type AttemptRouteContext = RouteContext<{ attemptId: string }>;

export async function GET(
  req: NextRequest,
  context: AttemptRouteContext,
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session?.actor) {
    return unauthorizedResponse();
  }

  const { attemptId } = await context.params;
  return getQuizAttemptController().getData(
    session.actor,
    session.moodleToken,
    attemptId,
    req,
  );
}
