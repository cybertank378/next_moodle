import { ForbiddenError, NotFoundError } from "@/core/errors";
import type { TenantContext } from "./TenantContext";
import type { TenantResolver } from "./TenantResolver";

export async function resolveCurrentTenant(
  request: Request,
  resolver: TenantResolver,
): Promise<TenantContext> {
  const explicitSlug =
    request.headers.get("x-tenant-slug") || request.headers.get("x-tenant-id");

  let identifier = explicitSlug?.trim();

  if (!identifier) {
    const hostHeader = request.headers.get("host");
    if (hostHeader) {
      // Strip port if present (e.g., localhost:3000 -> localhost)
      identifier = hostHeader.split(":")[0].trim();
    } else {
      try {
        const url = new URL(request.url);
        identifier = url.hostname;
      } catch {
        identifier = "";
      }
    }
  }

  if (!identifier) {
    throw new NotFoundError("Tenant could not be resolved from request");
  }

  const tenant = await resolver.resolveFromIdentifier(identifier);

  if (!tenant) {
    throw new NotFoundError("Tenant not found", { identifier });
  }

  if (tenant.status !== "ACTIVE") {
    throw new ForbiddenError(
      `Tenant access is denied: status is ${tenant.status}`,
      {
        tenantId: tenant.tenantId,
        status: tenant.status,
      },
    );
  }

  return tenant;
}
