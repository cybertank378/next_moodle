import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";

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
