import "server-only";

import type { NextRequest, NextResponse } from "next/server";


import { getAuthController } from "@/app/api/auth/_factory";

export async function POST(req: NextRequest): Promise<NextResponse> {
  return getAuthController().login(req);
}
