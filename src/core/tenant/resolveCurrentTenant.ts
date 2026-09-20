import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import type { TenantContext } from "./TenantContext";
import type { TenantResolver } from "./TenantResolver";

export class DefaultDevTenantResolver implements TenantResolver {
  public async resolve(): Promise<TenantContext> {
    return {
      tenantId: process.env.DEFAULT_TENANT_ID || "tenant_demo",
      slug: process.env.DEFAULT_TENANT_SLUG || "demo",
      status: "ACTIVE",
    };
  }
}

export async function resolveCurrentTenant(
  request: Request,
  resolver: TenantResolver = new DefaultDevTenantResolver(),
): Promise<TenantContext> {
  const url = new URL(request.url);
  const host = request.headers.get("host") || url.host;
  const headerSlug = request.headers.get("x-tenant-slug");
  const headerId = request.headers.get("x-tenant-id");

  // Determine identifier from header or host subdomain
  let identifier = headerSlug || headerId || "";
  if (!identifier && host) {
    const parts = host.split(":")[0]?.split(".") ?? [];
    if (parts.length > 2) {
      identifier = parts[0] || "";
    } else if (
      parts.length > 0 &&
      parts[0] !== "localhost" &&
      parts[0] !== "127"
    ) {
      identifier = parts[0] || "";
    }
  }

  const tenant = await resolver.resolve({
    identifier: identifier || "demo",
    host,
    headers: request.headers,
  });

  if (!tenant) {
    throw new NotFoundError(`Tenant '${identifier}' tidak ditemukan.`);
  }

  if (tenant.status === "INACTIVE") {
    throw new ForbiddenError(`Tenant '${tenant.slug}' tidak aktif.`, {
      code: "TENANT_INACTIVE",
    });
  }

  return tenant;
}
