import { ForbiddenError } from "@/core/errors/ForbiddenError";
import type { TenantStatus } from "../types/TenantStatus";

// biome-ignore lint/complexity/noStaticOnlyClass: domain rules collection
export class TenantRules {
  public static canAccess(status: TenantStatus): boolean {
    return status === "ACTIVE";
  }

  public static assertCanAccess(status: TenantStatus, slug?: string): void {
    const tenantLabel = slug ? `Tenant '${slug}'` : "Tenant";

    if (status === "INACTIVE") {
      throw new ForbiddenError(`${tenantLabel} tidak aktif. Akses diblokir.`, {
        code: "TENANT_INACTIVE",
      });
    }

    if (status === "SUSPENDED") {
      throw new ForbiddenError(
        `${tenantLabel} sedang ditangguhkan (SUSPENDED). Hubungi administrator.`,
        {
          code: "TENANT_SUSPENDED",
        },
      );
    }
  }
}
