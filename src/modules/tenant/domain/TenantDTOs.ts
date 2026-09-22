import type { TenantDomainStatus } from "./TenantTypes";

// ---- Request DTOs ----

export interface CreateTenantRequestDTO {
  slug: string;
  name: string;
  customDomain?: string | null;
}

export interface UpdateTenantRequestDTO {
  name?: string;
  customDomain?: string | null;
}

export interface UpdateTenantStatusRequestDTO {
  status: TenantDomainStatus;
}

export interface ListTenantsRequestDTO {
  status?: TenantDomainStatus;
  search?: string;
  page?: number;
  pageSize?: number;
}

// ---- Response DTOs ----

export interface TenantBrandingResponseDTO {
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  faviconUrl: string | null;
}

/**
 * Credential response DTO — NEVER includes token/ciphertext fields.
 */
export interface TenantCredentialSummaryDTO {
  moodleUrl: string;
  timeoutBudgetMs: number;
  sslVerify: boolean;
  hasProctorToken: boolean;
}

export interface TenantResponseDTO {
  id: string;
  slug: string;
  name: string;
  status: TenantDomainStatus;
  customDomain: string | null;
  credential: TenantCredentialSummaryDTO | null;
  branding: TenantBrandingResponseDTO | null;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

export interface TenantSummaryResponseDTO {
  id: string;
  slug: string;
  name: string;
  status: TenantDomainStatus;
  customDomain: string | null;
  hasMoodleCredential: boolean;
  hasBranding: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListTenantsResponseDTO {
  tenants: TenantSummaryResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
}
