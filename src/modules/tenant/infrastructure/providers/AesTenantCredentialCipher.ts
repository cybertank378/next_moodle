import {
  AesHkdfEncryptionProvider,
  type TenantEncryptionProvider,
} from "@/core/security/AesHkdfEncryptionProvider";
import type { TenantCredentialCipher } from "@/modules/tenant/domain/interfaces/TenantInterfaces";

export class AesTenantCredentialCipher implements TenantCredentialCipher {
  constructor(private readonly encryption?: TenantEncryptionProvider) {}

  encrypt(plainText: string, tenantId: string): Promise<string> {
    const provider = this.encryption ?? new AesHkdfEncryptionProvider();
    return provider.encrypt(plainText, tenantId);
  }
}
