import { getExamAdministrationController } from "@/app/api/exam-admin/_factory";

export async function PATCH(
  req: Request,
  { params }: { params: { quizId: string } },
) {
  const controller = getExamAdministrationController();
  return await controller.reorderQuizQuestions(req, Number(params.quizId));
}
