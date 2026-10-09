import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getUserController } from "@/app/api/users/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function POST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getUserController().import(actor, req)
    : unauthorizedResponse();
}
