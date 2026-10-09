import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
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

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getEnrolmentController().enrol(actor, req)
    : unauthorizedResponse();
}

async function originalDELETE(req: NextRequest): Promise<NextResponse> {
  const actor = await getCurrentUser();
  return actor
    ? getEnrolmentController().unenrol(actor, req)
    : unauthorizedResponse();
}

export const POST = withAuditedMutation(originalPOST, "enrolments");
export const DELETE = withAuditedMutation(originalDELETE, "enrolments");
