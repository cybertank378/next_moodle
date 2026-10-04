import { getQuestionController } from "./_factory";

export async function POST(req: Request) {
  return getQuestionController().createQuestion(req);
}
