import type { NextRequest } from "next/server";
import { getQuestionController } from "@/app/api/questions/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

export async function GET(req: NextRequest) {
  return getQuestionController().getCategories(req);
}

async function originalPOST(req: NextRequest) {
  return getQuestionController().createCategory(req);
}

export const POST = withAuditedMutation(originalPOST, "question-categories");
