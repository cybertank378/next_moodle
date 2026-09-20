import type {
  TenantCredentialRepository,
  TenantMoodleCredential,
} from "@/modules/tenant/domain/interfaces/TenantCredentialRepository";
import {
  type AesGcmEncryptionProvider,
  defaultEncryptionProvider,
} from "../providers/AesGcmEncryptionProvider";

export class DatabaseTenantCredentialRepository
  implements TenantCredentialRepository
{
  private readonly credentialsByTenantId = new Map<
    string,
    TenantMoodleCredential
  >();

  constructor(
    encryptionProvider: AesGcmEncryptionProvider = defaultEncryptionProvider,
  ) {
    // Seed demo tenant encrypted token
    const demoToken = process.env.DEFAULT_MOODLE_TOKEN || "mock_demo_token";
    const encrypted = encryptionProvider.encrypt(demoToken);

    this.credentialsByTenantId.set("tenant_demo", {
      id: "cred-demo",
      tenantId: "tenant_demo",
      encryptedToken: encrypted.encryptedValue,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyVersion: encrypted.keyVersion,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }

  public async getByTenantId(
    tenantId: string,
  ): Promise<TenantMoodleCredential | null> {
    const cred = this.credentialsByTenantId.get(tenantId);
    return cred ? { ...cred } : null;
  }

  public async save(credential: TenantMoodleCredential): Promise<void> {
    this.credentialsByTenantId.set(credential.tenantId, {
      ...credential,
      updatedAt: new Date(),
    });
  }

  public async deleteByTenantId(tenantId: string): Promise<void> {
    this.credentialsByTenantId.delete(tenantId);
  }
}
