import type { NextRequest } from "next/server";

import { getExamAdministrationController } from "@/app/api/exam/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPATCH(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params;
  const controller = getExamAdministrationController();
  return await controller.reorderQuizQuestions(req, Number(quizId));
}

export const PATCH = withAuditedMutation(
  originalPATCH,
  "exam/quizzes/:id/questions/reorder",
);
