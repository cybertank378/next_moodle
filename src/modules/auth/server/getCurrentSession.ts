import "server-only";

import { cookies } from "next/headers";
import { getAuthRepository } from "@/app/api/auth/_factory";
import type { AppSessionPayload } from "../domain/interfaces/AuthInterfaces";

export async function getCurrentSession(): Promise<AppSessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;

    if (!sessionToken) {
      return null;
    }

    return await getAuthRepository().resolveSession(sessionToken);
  } catch {
    return null;
  }
}
