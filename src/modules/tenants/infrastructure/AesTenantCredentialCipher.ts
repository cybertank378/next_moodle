import type { TenantEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import type { TenantCredentialCipher } from "@/modules/tenants/domain/interfaces/TenantsInterfaces";

export class AesTenantCredentialCipher implements TenantCredentialCipher {
  constructor(private readonly encryption: TenantEncryptionProvider) {}

  encrypt(plainText: string, tenantId: string): Promise<string> {
    return this.encryption.encrypt(plainText, tenantId);
  }
}
