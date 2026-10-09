import type { NextRequest } from "next/server";
import { getExamMonitorController } from "@/app/api/exam-monitor/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPOST(req: NextRequest) {
  return await getExamMonitorController().extendTime(req);
}

export const POST = withAuditedMutation(
  originalPOST,
  "exam-monitor/extend-time",
);
