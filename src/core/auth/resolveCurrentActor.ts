import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { AuthRepository } from "@/modules/auth/infrastructure/repo/AuthRepository";
import { cookies } from "next/headers";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import type { SessionRepository } from "@/core/auth/SessionRepository";
import { getAuthRepository } from "@/app/api/auth/_factory";

export async function extractTokenFromRequest(request: Request): Promise<string | null> {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring("Bearer ".length).trim();
    if (token) return token;
  }

  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session_token")?.value;
  if (sessionToken) return sessionToken;

  const authToken = cookieStore.get("auth_token")?.value;
  if (authToken) return authToken;

  return null;
}

export async function resolveCurrentActor(
  request: Request,
  sessionRepository?: SessionRepository,
): Promise<CurrentActor> {
  const token = await extractTokenFromRequest(request);

  if (!token) {
    throw new UnauthorizedError("Authentication token is missing");
  }

  if (!sessionRepository) {
    return (await getAuthRepository().resolveSession(token)).actor;
  }

  const session = await sessionRepository.findByToken(token);

  if (!session) {
    throw new UnauthorizedError("Invalid session");
  }

  if (session.isRevoked) {
    throw new UnauthorizedError("Session has been revoked");
  }

  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  if (now >= expiresAt) {
    throw new UnauthorizedError("Session has expired");
  }

  return session.actor;
}
