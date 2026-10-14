import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getQuizController } from "@/app/api/quizzes/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getQuizController().list(req);
}
