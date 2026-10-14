import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getAssignmentController } from "@/app/api/assignments/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;

  return getAssignmentController().getAssignmentDetail({
    actor: session.actor,
    assignmentId: id,
    moodleToken: session.moodleToken,
  }) as unknown as NextResponse;
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> },
): Promise<NextResponse> {
  const session = await getCurrentSession();
  if (!session) {
    return unauthorizedResponse();
  }

  const { id } = await context.params;
  const body = await req.json().catch(() => ({}));

  return getAssignmentController().submitAssignment({
    actor: session.actor,
    assignmentId: id,
    data: body,
    moodleToken: session.moodleToken,
  }) as unknown as NextResponse;
}
