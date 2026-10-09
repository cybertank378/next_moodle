import type { NextRequest } from "next/server";
import { getExamMonitorController } from "./_factory";

export async function GET(req: NextRequest) {
  return await getExamMonitorController().getMonitor(req);
}
