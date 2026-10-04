import { getQuestionController } from "@/app/api/questions/_factory";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getQuestionController().updateQuestion(req, id);
}
