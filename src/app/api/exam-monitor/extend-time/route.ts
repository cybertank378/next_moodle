import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import type { NextRequest } from "next/server";
import { getExamMonitorController } from "@/app/api/exam-monitor/_factory";

async function originalPOST(req: NextRequest) {
  return await getExamMonitorController().extendTime(req);
}

export const POST = withAuditedMutation(originalPOST, "exam-monitor/extend-time");
