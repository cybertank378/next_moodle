export interface TenantCredentialProps {
  id: string;
  tenantId: string;
  moodleUrl: string;
  encryptedAdminToken: string;
  encryptedProctorToken?: string | null;
  timeoutBudgetMs: number;
  sslVerify: boolean;
  createdAt: Date;
  updatedAt: Date;
}
