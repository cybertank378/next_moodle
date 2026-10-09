import { withAuditedMutation } from "@/modules/audit/infrastructure/http/withAuditedMutation";
// Files: src/app/api/firebase/subscribe/route.ts
import { applicationDefault, getApps, initializeApp } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";
import { NextResponse } from "next/server";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";

import { normalizeFcmTopic } from "@/modules/notification/domain/helpers/fcmTopicHelper";

if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault(),
    });
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin:", error);
  }
}

async function originalPOST(req: Request) {
  try {
    const actor = await resolveCurrentActor(req);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const topic = normalizeFcmTopic(actor.tenantId, actor.role, actor.userId);

    await getMessaging().subscribeToTopic([token], topic);

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error("Firebase subscribe error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

async function originalDELETE(req: Request) {
  try {
    const actor = await resolveCurrentActor(req);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const topic = normalizeFcmTopic(actor.tenantId, actor.role, actor.userId);

    await getMessaging().unsubscribeFromTopic([token], topic);

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error("Firebase unsubscribe error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}


export const POST = withAuditedMutation(originalPOST, "firebase/subscribe");
export const DELETE = withAuditedMutation(originalDELETE, "firebase/subscribe");
