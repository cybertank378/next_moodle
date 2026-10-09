import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import { getExamAdministrationController } from "@/app/api/exam/_factory";

async function originalPATCH(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params;
  const controller = getExamAdministrationController();
  return await controller.reorderQuizQuestions(req, Number(quizId));
}

export const PATCH = withAuditedMutation(originalPATCH, "exam/quizzes/:id/questions/reorder");
