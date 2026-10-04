import { getQuestionController } from "@/app/api/questions/_factory";

export async function POST(req: Request) {
  return getQuestionController().createQuestion(req);
}
