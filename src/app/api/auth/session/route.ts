import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getAuthController } from "@/app/api/auth/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getAuthController().currentSession(req);
}
