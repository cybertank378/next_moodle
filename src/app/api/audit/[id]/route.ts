import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { getAuditController } from "@/app/api/audit/_factory";
export async function GET(
  request: NextRequest,
  context: RouteContext<"/api/audit/[id]">,
): Promise<NextResponse> {
  const { id } = await context.params;
  return getAuditController().detail(request, id);
}
