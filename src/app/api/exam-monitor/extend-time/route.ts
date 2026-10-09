import type { NextRequest } from "next/server";
import { getExamMonitorController } from "@/app/api/exam-monitor/_factory";

export async function POST(req: NextRequest) {
  return await getExamMonitorController().extendTime(req);
}
