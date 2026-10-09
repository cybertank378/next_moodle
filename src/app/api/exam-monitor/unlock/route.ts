import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
import type { NextRequest } from "next/server";
import { getExamMonitorController } from "../_factory";

async function originalPOST(req: NextRequest) {
  return await getExamMonitorController().unlockAttempt(req);
}

export const POST = withAuditedMutation(originalPOST, "exam-monitor/unlock");
