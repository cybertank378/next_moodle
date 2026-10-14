import "server-only";

import type { NextRequest, NextResponse } from "next/server";

import { getFirebaseSubscriptionController } from "@/app/api/firebase/_factory";
import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";

async function originalPOST(req: NextRequest): Promise<NextResponse> {
  return getFirebaseSubscriptionController().subscribe(req);
}

async function originalDELETE(req: NextRequest): Promise<NextResponse> {
  return getFirebaseSubscriptionController().unsubscribe(req);
}

export const POST = withAuditedMutation(originalPOST, "firebase/subscribe");
export const DELETE = withAuditedMutation(originalDELETE, "firebase/subscribe");
