import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";
import {
  type RouteContext,
  unauthorizedResponse,
} from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

type AttemptRouteContext = RouteContext<{ attemptId: string }>;

async function originalPOST(
  req: NextRequest,
  context: AttemptRouteContext,
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session?.actor) {
    return unauthorizedResponse();
  }

  const { attemptId } = await context.params;
  return getQuizAttemptController().save(
    session.actor,
    session.moodleToken,
    attemptId,
    req,
  );
}

export const POST = withAuditedMutation(originalPOST, "quizzes/attempts/:id/save");
