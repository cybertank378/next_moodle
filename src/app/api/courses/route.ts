import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getCourseController } from "@/app/api/courses/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getCourseController().list(actor, req)
    : unauthorizedResponse();
}
