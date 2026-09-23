export type TenantStatus = "ACTIVE" | "MAINTENANCE" | "SUSPENDED";

export interface TenantListFilter {
  status?: TenantStatus;
  search?: string;
  page: number;
  pageSize: number;
}

export interface TenantCredentialMetadata {
  moodleUrl: string;
  timeoutBudgetMs: number;
  sslVerify: boolean;
  hasAdminToken: boolean;
  hasProctorToken: boolean;
  configuredAt: Date;
}

export interface TenantBrandingMetadata {
  logoUrl: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  faviconUrl: string | null;
}
