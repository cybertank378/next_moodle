import "server-only";

import { cookies } from "next/headers";
import type { CurrentActor } from "@/core/auth/CurrentActor";

export async function getCurrentUser(): Promise<CurrentActor | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    // In full session implementation, sessionRepository.findByToken is invoked here.
    // For initial bootstrap, parse or return unauthenticated if invalid.
    return null;
  } catch {
    return null;
  }
}
