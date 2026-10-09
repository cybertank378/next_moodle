import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session?.actor) {
    return unauthorizedResponse();
  }

  return getQuizAttemptController().start(
    session.actor,
    session.moodleToken,
    req,
  );
}

export const POST = withAuditedMutation(originalPOST, "quizzes/attempts/start");
