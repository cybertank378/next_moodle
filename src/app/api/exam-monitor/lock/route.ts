import type { NextRequest } from "next/server";
import { getExamMonitorController } from "../_factory";

export async function POST(req: NextRequest) {
  return await getExamMonitorController().lockAttempt(req);
}
