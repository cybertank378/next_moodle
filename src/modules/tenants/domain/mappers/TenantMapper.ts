import type { Tenant } from "@/modules/tenants/domain/entities/Tenant";
import type {
  TenantResponseDTO,
  TenantSummaryResponseDTO,
} from "@/modules/tenants/domain/dto/TenantDTOs";

export const TenantMapper = {
  toDetailResponse(tenant: Tenant): TenantResponseDTO {
    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      customDomain: tenant.customDomain,
      credential: tenant.credential
        ? {
            moodleUrl: tenant.credential.moodleUrl,
            timeoutBudgetMs: tenant.credential.timeoutBudgetMs,
            sslVerify: tenant.credential.sslVerify,
            hasAdminToken: tenant.credential.hasAdminToken,
            hasProctorToken: tenant.credential.hasProctorToken,
            configuredAt: tenant.credential.configuredAt.toISOString(),
          }
        : null,
      branding: tenant.branding,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  },

  toSummaryResponse(tenant: Tenant): TenantSummaryResponseDTO {
    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      customDomain: tenant.customDomain,
      hasMoodleCredential: tenant.credential !== null,
      hasBranding: tenant.branding !== null,
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  },
} as const;
