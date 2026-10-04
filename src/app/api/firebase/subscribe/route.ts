import { NextResponse } from "next/server";
import { resolveCurrentActor } from "@/core/auth/resolveCurrentActor";
import { getApps, initializeApp, applicationDefault } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

if (!getApps().length) {
  try {
    initializeApp({
      credential: applicationDefault(),
    });
  } catch (error) {
    console.warn("Failed to initialize Firebase Admin:", error);
  }
}

export async function POST(req: Request) {
  try {
    const actor = await resolveCurrentActor(req);
    if (!actor) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const tenantPart = actor.tenantId ?? "platform";
    const topic = `${tenantPart}-${actor.role}-${actor.userId}`;

    await getMessaging().subscribeToTopic([token], topic);

    return NextResponse.json({ success: true, topic });
  } catch (error) {
    console.error("Firebase subscribe error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
