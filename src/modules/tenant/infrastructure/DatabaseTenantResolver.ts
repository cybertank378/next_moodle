import type { TenantContext } from "@/core/tenant/TenantContext";
import type { TenantResolver } from "@/core/tenant/TenantResolver";
import type { Tenant } from "@/modules/tenant/domain/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";

/**
 * Resolves a request identifier (slug, custom domain, or hostname)
 * to an authenticated TenantContext using the tenant repository.
 */
export class DatabaseTenantResolver implements TenantResolver {
  constructor(private readonly tenantRepository: TenantRepository) {}

  private toTenantContext(tenant: Tenant): TenantContext {
    return {
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      status: tenant.status,
      customDomain: tenant.customDomain ?? undefined,
    };
  }

  async resolveFromIdentifier(
    identifier: string,
  ): Promise<TenantContext | null> {
    if (!identifier || identifier.trim() === "") {
      return null;
    }

    const clean = identifier.trim().toLowerCase();

    // 1. Try resolving by exact slug (fastest for API headers / direct slugs)
    const bySlug = await this.tenantRepository.findBySlug(clean);
    if (bySlug) {
      return this.toTenantContext(bySlug);
    }

    // 2. Try resolving by customDomain (e.g. exam.school.edu)
    const byDomain = await this.tenantRepository.findByCustomDomain(clean);
    if (byDomain) {
      return this.toTenantContext(byDomain);
    }

    // 3. Try resolving by subdomain prefix if the identifier contains a dot
    // (e.g. "school-alpha.platform.com" -> extracts "school-alpha")
    if (clean.includes(".")) {
      const subdomain = clean.split(".")[0];
      if (subdomain && subdomain !== clean) {
        const bySubdomain = await this.tenantRepository.findBySlug(subdomain);
        if (bySubdomain) {
          return this.toTenantContext(bySubdomain);
        }
      }
    }

    return null;
  }
}
