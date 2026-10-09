import { getExamAdministrationController } from "@/app/api/exam/_factory";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ quizId: string }> },
) {
  const { quizId } = await params;
  const controller = getExamAdministrationController();
  return await controller.reorderQuizQuestions(req, Number(quizId));
}
