import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { CurrentActor } from "./CurrentActor";
import type { SessionRepository } from "./SessionRepository";

function extractTokenFromRequest(request: Request): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.substring("Bearer ".length).trim();
    if (token) return token;
  }

  const cookieHeader = request.headers.get("cookie");
  if (cookieHeader) {
    const cookies = cookieHeader.split(";").map((c) => c.trim());
    for (const cookie of cookies) {
      if (cookie.startsWith("session_token=")) {
        const token = cookie.substring("session_token=".length).trim();
        if (token) return token;
      }
      if (cookie.startsWith("auth_token=")) {
        const token = cookie.substring("auth_token=".length).trim();
        if (token) return token;
      }
    }
  }

  return null;
}

export async function resolveCurrentActor(
  request: Request,
  sessionRepository: SessionRepository,
): Promise<CurrentActor> {
  const token = extractTokenFromRequest(request);

  if (!token) {
    throw new UnauthorizedError("Authentication token is missing");
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
