import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getAssignmentController } from "@/app/api/assignments/_factory";

export async function GET(req: NextRequest): Promise<NextResponse> {
  return getAssignmentController().getStudentAssignments(req);
}
