import type { TenantStatus } from "@/modules/tenants/domain/types/TenantTypes";

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
  status: TenantStatus;
}

export interface ConfigureTenantCredentialRequestDTO {
  moodleUrl: string;
  adminToken: string;
  proctorToken?: string | null;
  timeoutBudgetMs?: number;
  sslVerify?: boolean;
}

export interface TenantCredentialResponseDTO {
  moodleUrl: string;
  timeoutBudgetMs: number;
  sslVerify: boolean;
  hasAdminToken: boolean;
  hasProctorToken: boolean;
  configuredAt: string;
}

export interface TenantBrandingResponseDTO {
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  faviconUrl: string | null;
}

export interface TenantResponseDTO {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  customDomain: string | null;
  credential: TenantCredentialResponseDTO | null;
  branding: TenantBrandingResponseDTO | null;
  createdAt: string;
  updatedAt: string;
}

export interface TenantSummaryResponseDTO {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
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
