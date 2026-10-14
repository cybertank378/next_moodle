import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { getAuditController } from "@/app/api/audit/_factory";
export async function GET(request: NextRequest): Promise<NextResponse> {
  return getAuditController().list(request);
}
