import type { Tenant } from "./Tenant";
import type {
  TenantBrandingResponseDTO,
  TenantCredentialSummaryDTO,
  TenantResponseDTO,
  TenantSummaryResponseDTO,
} from "./TenantDTOs";

/**
 * mapTenantToResponseDTO — translates a Tenant domain entity to a full response DTO.
 * IMPORTANT: Credential ciphertext (encryptedAdminToken, encryptedProctorToken)
 * must NEVER appear in any DTO output.
 */
export function mapTenantToResponseDTO(tenant: Tenant): TenantResponseDTO {
  const cred = tenant.credential;
  const brand = tenant.branding;

  const credential: TenantCredentialSummaryDTO | null = cred
    ? {
        moodleUrl: cred.moodleUrl,
        timeoutBudgetMs: cred.timeoutBudgetMs,
        sslVerify: cred.sslVerify,
        hasProctorToken:
          cred.encryptedProctorToken != null &&
          cred.encryptedProctorToken.trim().length > 0,
      }
    : null;

  const branding: TenantBrandingResponseDTO | null = brand
    ? {
        logoUrl: brand.logoUrl ?? null,
        primaryColor: brand.primaryColor ?? null,
        accentColor: brand.accentColor ?? null,
        faviconUrl: brand.faviconUrl ?? null,
      }
    : null;

  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    status: tenant.status,
    customDomain: tenant.customDomain ?? null,
    credential,
    branding,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };
}

/**
 * mapTenantToSummaryDTO — translates a Tenant domain entity to a lightweight summary DTO.
 * IMPORTANT: No credential details are included.
 */
export function mapTenantToSummaryDTO(
  tenant: Tenant,
): TenantSummaryResponseDTO {
  return {
    id: tenant.id,
    slug: tenant.slug,
    name: tenant.name,
    status: tenant.status,
    customDomain: tenant.customDomain ?? null,
    hasMoodleCredential: tenant.credential != null,
    hasBranding: tenant.branding != null,
    createdAt: tenant.createdAt.toISOString(),
    updatedAt: tenant.updatedAt.toISOString(),
  };
}

/**
 * TenantMapper — backward-compatible namespace alias.
 * @deprecated Use named exports `mapTenantToResponseDTO` / `mapTenantToSummaryDTO` directly.
 */
export const TenantMapper = {
  toResponseDTO: mapTenantToResponseDTO,
  toSummaryDTO: mapTenantToSummaryDTO,
} as const;
