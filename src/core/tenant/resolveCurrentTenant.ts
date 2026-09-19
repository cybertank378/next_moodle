import type { NextRequest } from "next/server";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import type { TenantContext } from "./TenantContext";

export async function resolveCurrentTenant(request: NextRequest): Promise<TenantContext> {
  const headerTenantId = request.headers.get("x-tenant-id");
  const headerTenantSlug = request.headers.get("x-tenant-slug");
  const host = request.headers.get("host") || "";

  // Check custom headers or subdomains
  const slugFromHost = host.split(".")[0] || "demo";
  const slug = headerTenantSlug || slugFromHost;
  const tenantId = headerTenantId || `tenant_${slug}`;

  // Fallback / default tenant configuration for local dev and bootstrap
  const defaultUrl = process.env.DEFAULT_MOODLE_URL || "https://moodle.example.com";
  const defaultToken = process.env.DEFAULT_MOODLE_TOKEN || "mock_moodle_token";

  const context: TenantContext = {
    tenantId,
    slug,
    name: slug.toUpperCase(),
    moodleUrl: defaultUrl,
    moodleToken: defaultToken,
    isActive: true,
  };

  if (!context.isActive) {
    throw new UnauthorizedError(`Tenant '${context.slug}' is inactive`);
  }

  return context;
}
