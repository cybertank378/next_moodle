import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { ValidationError } from "../errors/ValidationError";
import type { TenantContext } from "./TenantContext";
import type { TenantResolver } from "./TenantResolver";

export class DefaultDevTenantResolver implements TenantResolver {
  public async resolve(): Promise<TenantContext> {
    return {
      tenantId: process.env.DEFAULT_TENANT_ID || "tenant_demo",
      slug: process.env.DEFAULT_TENANT_SLUG || "demo",
      name: process.env.DEFAULT_TENANT_NAME || "Demo Institution",
      status: "ACTIVE",
    };
  }
}

export async function resolveCurrentTenant(
  request: Request,
  resolver: TenantResolver = new DefaultDevTenantResolver(),
): Promise<TenantContext> {
  const rawHost =
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    new URL(request.url).host;

  if (!rawHost || typeof rawHost !== "string") {
    throw new ValidationError("Header host tidak valid atau tidak ditemukan.", {
      code: "TENANT_HOST_INVALID",
    });
  }

  // 1. Hostname Normalization: lowercase, trim, remove port
  const normalizedHost = rawHost.trim().toLowerCase().split(":")[0] || "";

  const rootDomain = (process.env.APP_ROOT_DOMAIN || "exam.example.com")
    .trim()
    .toLowerCase();

  const headerSlug = request.headers.get("x-tenant-slug");
  const headerId = request.headers.get("x-tenant-id");

  let slug: string | null = null;

  // 2. Direct Header Override (for internal service/testing)
  if (headerSlug) {
    slug = headerSlug.trim().toLowerCase();
  } else if (headerId) {
    slug = headerId.trim().toLowerCase();
  } else if (normalizedHost === rootDomain) {
    // Access directly to root domain without tenant
    throw new NotFoundError(
      `Akses ke root domain '${rootDomain}' tidak terikat pada tenant manapun.`,
      { code: "TENANT_NOT_FOUND" },
    );
  } else if (normalizedHost.endsWith(`.${rootDomain}`)) {
    // Subdomain on root domain: e.g. smpn29.exam.example.com
    slug = normalizedHost.slice(0, -(rootDomain.length + 1));
  } else if (normalizedHost.endsWith(".localhost")) {
    // Local development subdomain: e.g. smpn29.localhost
    slug = normalizedHost.slice(0, -".localhost".length);
  } else if (normalizedHost === "localhost" || normalizedHost === "127.0.0.1") {
    slug = process.env.DEFAULT_TENANT_SLUG || "demo";
  } else {
    // If it's a test/development single-level or sub-level host like 'sekolah-a.exam.test'
    const parts = normalizedHost.split(".");
    if (
      parts.length >= 3 &&
      !parts.includes("example") &&
      parts[parts.length - 1] === "test"
    ) {
      slug = parts[0];
    } else if (parts.length >= 3) {
      slug = parts[0];
    } else {
      throw new ValidationError(
        `Host '${rawHost}' bukan domain yang sah untuk aplikasi tenant.`,
        { code: "TENANT_HOST_INVALID" },
      );
    }
  }

  // 3. Resolve tenant
  const tenant = await resolver.resolve({
    hostname: normalizedHost,
    identifier: slug,
    headers: request.headers,
  });

  if (!tenant) {
    throw new NotFoundError(`Tenant '${slug}' tidak ditemukan.`, {
      code: "TENANT_NOT_FOUND",
    });
  }

  // 4. Enforce tenant status
  if (tenant.status === "INACTIVE") {
    throw new ForbiddenError(`Tenant '${tenant.slug}' tidak aktif.`, {
      code: "TENANT_INACTIVE",
    });
  }

  if (tenant.status === "SUSPENDED") {
    throw new ForbiddenError(
      `Tenant '${tenant.slug}' sedang ditangguhkan (SUSPENDED).`,
      { code: "TENANT_SUSPENDED" },
    );
  }

  return tenant;
}
