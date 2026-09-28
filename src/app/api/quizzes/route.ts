import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizController } from "@/app/api/quizzes/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  if (!actor) return unauthorizedResponse();

  return getQuizController().list(actor, req);
}
