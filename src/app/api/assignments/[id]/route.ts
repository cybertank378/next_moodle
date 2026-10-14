import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getAssignmentController } from "@/app/api/assignments/_factory";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return getAssignmentController().getAssignmentDetail(req, id);
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const { id } = await context.params;
  return getAssignmentController().submitAssignment(req, id);
}
