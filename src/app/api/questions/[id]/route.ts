import { getQuestionController } from "../_factory";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return getQuestionController().updateQuestion(req, id);
}
