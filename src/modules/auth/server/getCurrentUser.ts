import "server-only";

import { cookies } from "next/headers";
import { getAuthSessionManager } from "@/app/api/auth/_factory";
import type { CurrentActor } from "@/core/auth/CurrentActor";

export async function getCurrentUser(): Promise<CurrentActor | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    const session = await getAuthSessionManager().resolveSession(sessionToken);
    return session.actor;
  } catch {
    return null;
  }
}
