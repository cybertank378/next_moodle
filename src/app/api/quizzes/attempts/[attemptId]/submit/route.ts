import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";
import type { RouteContext } from "@/core/http/routeUtils";

type AttemptRouteContext = RouteContext<{ attemptId: string }>;

async function originalPOST(
  req: NextRequest,
  context: AttemptRouteContext,
): Promise<NextResponse> {
  const { attemptId } = await context.params;
  return getQuizAttemptController().submit(attemptId, req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "quizzes/attempts/:id/submit",
);
