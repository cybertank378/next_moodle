import { getQuestionController } from "@/app/api/questions/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return getQuestionController().updateQuestion(req, id);
}

export const PATCH = withAuditedMutation(originalPATCH, "questions/:id");
