import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getGradeController } from "@/app/api/grades/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session?.actor) {
    return unauthorizedResponse();
  }

  return getGradeController().exportGrades(session.actor, req);
}
