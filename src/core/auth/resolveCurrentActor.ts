import { ForbiddenError } from "../errors/ForbiddenError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import type { TenantContext } from "../tenant/TenantContext";
import type { CurrentActor } from "./CurrentActor";
import type { SessionResolver } from "./SessionResolver";

export class DefaultDevSessionResolver implements SessionResolver {
  public async resolve(request: Request) {
    const authHeader = request.headers.get("authorization");
    if (!authHeader && process.env.NODE_ENV !== "development") {
      return null;
    }

    return {
      id: "sess_demo",
      userId: "usr_demo",
      tenantId: "tenant_demo",
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      roles: ["student"],
    };
  }
}

export async function resolveCurrentActor(
  request: Request,
  resolver: SessionResolver = new DefaultDevSessionResolver(),
  currentTenant?: TenantContext,
): Promise<CurrentActor> {
  const session = await resolver.resolve(request);

  if (!session) {
    throw new UnauthorizedError("Sesi tidak ditemukan atau tidak valid.");
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    throw new UnauthorizedError("Sesi telah kedaluwarsa.");
  }

  if (currentTenant && session.tenantId !== currentTenant.tenantId) {
    throw new ForbiddenError("Sesi tidak valid untuk tenant ini.", {
      code: "TENANT_MISMATCH",
    });
  }

  return {
    userId: session.userId,
    tenantId: session.tenantId,
    roles: session.roles || [],
  };
}
