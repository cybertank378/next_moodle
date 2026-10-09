import "server-only";

import type { NextRequest, NextResponse } from "next/server";
import { getEnrolmentController } from "@/app/api/enrolments/_factory";
import { unauthorizedResponse } from "@/core/http/routeUtils";
import { getCurrentUser } from "@/modules/auth/server/getCurrentUser";

export async function GET(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getEnrolmentController().list(actor, req)
    : unauthorizedResponse();
}

export async function POST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getEnrolmentController().enrol(actor, req)
    : unauthorizedResponse();
}

export async function DELETE(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getEnrolmentController().unenrol(actor, req)
    : unauthorizedResponse();
}
