import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return getQuizAttemptController().start(req);
}

export const POST = withAuditedMutation(originalPOST, "quizzes/attempts/start");
