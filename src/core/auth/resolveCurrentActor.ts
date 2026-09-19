import type { NextRequest } from "next/server";
import type { CurrentActor } from "./CurrentActor";

export async function resolveCurrentActor(request: NextRequest): Promise<CurrentActor | null> {
  const authHeader = request.headers.get("authorization");
  const sessionCookie = request.cookies.get("session_token")?.value;

  if (!authHeader && !sessionCookie) {
    // For development / initial bootstrap when actor is not yet passed via cookie/token,
    // provide a fallback demo student actor if requested or null.
    const devMockHeader = request.headers.get("x-mock-actor");
    if (devMockHeader === "student" || process.env.NODE_ENV === "development") {
      return {
        id: "usr_mock_1",
        username: "student1",
        email: "student1@example.com",
        firstname: "Demo",
        lastname: "Student",
        moodleUserId: 2,
        tenantId: "tenant_demo",
        roles: ["student"],
      };
    }
    return null;
  }

  // TODO: Validate against SessionRepository in production
  return {
    id: "usr_active_session",
    username: "authenticated_user",
    email: "user@example.com",
    firstname: "Authenticated",
    lastname: "User",
    moodleUserId: 2,
    tenantId: "tenant_demo",
    roles: ["student"],
  };
}
