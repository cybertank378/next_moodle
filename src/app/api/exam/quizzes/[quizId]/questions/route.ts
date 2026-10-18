import type { NextRequest } from "next/server";
import { getExamAdministrationController } from "@/app/api/exam/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params;
  const controller = getExamAdministrationController();
  return await controller.getQuizQuestions(req, Number(quizId));
}

async function originalPOST(
  req: NextRequest,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params;
  const controller = getExamAdministrationController();
  const cloned = req.clone();
  const body = await cloned.json();

  if (body.isRandom || (body.categoryId && body.randomCount)) {
    return await controller.addRandomQuestions(req, Number(quizId));
  }

  return await controller.addQuestionToQuiz(req, Number(quizId));
}

export const POST = withAuditedMutation(
  originalPOST,
  "exam/quizzes/:id/questions",
);
