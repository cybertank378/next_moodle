import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizAttemptController } from "@/app/api/quizzes/attempts/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getQuizAttemptController().list(req);
}
