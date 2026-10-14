import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getDashboardController } from "@/app/api/dashboard/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getDashboardController().getAdminOverview(req);
}
