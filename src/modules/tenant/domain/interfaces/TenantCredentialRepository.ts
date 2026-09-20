export interface TenantMoodleCredential {
  readonly id?: string;
  readonly tenantId: string;
  readonly encryptedToken: string;
  readonly iv: string;
  readonly authTag: string;
  readonly keyVersion: string;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export interface TenantCredentialRepository {
  getByTenantId(tenantId: string): Promise<TenantMoodleCredential | null>;
  save(credential: TenantMoodleCredential): Promise<void>;
  deleteByTenantId(tenantId: string): Promise<void>;
}
