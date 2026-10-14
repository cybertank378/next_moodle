import type { NextRequest } from "next/server";

import { getDashboardController } from "@/app/api/dashboard/_factory";

export async function GET(req: NextRequest) {
  const controller = getDashboardController();
  return controller.getProctorOverview(req);
}
