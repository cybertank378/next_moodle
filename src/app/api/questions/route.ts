import { getQuestionController } from "@/app/api/questions/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPOST(req: Request) {
  return getQuestionController().createQuestion(req);
}

export const POST = withAuditedMutation(originalPOST, "questions");
