import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";

export interface InitialTenantAdminDTO {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
}

export interface CreateTenantRequestDTO {
  slug: string;
  name: string;
  status?: TenantStatus;
  customDomain?: string | null;
  adminUser?: InitialTenantAdminDTO | null;
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
