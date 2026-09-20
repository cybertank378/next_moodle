import "server-only";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type {
  MoodleCredential,
  MoodleCredentialProvider,
} from "@/core/moodle/MoodleCredentialProvider";
import type { TenantContext } from "@/core/tenant/TenantContext";
import type { TenantCredentialRepository } from "@/modules/tenant/domain/interfaces/TenantCredentialRepository";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import { TenantRules } from "@/modules/tenant/domain/rules/TenantRules";
import {
  type AesGcmEncryptionProvider,
  defaultEncryptionProvider,
} from "./AesGcmEncryptionProvider";

export class EncryptedTenantCredentialProvider
  implements MoodleCredentialProvider
{
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly credentialRepository: TenantCredentialRepository,
    private readonly encryptionProvider: AesGcmEncryptionProvider = defaultEncryptionProvider,
  ) {}

  public async getCredential(tenant: TenantContext): Promise<MoodleCredential> {
    const tenantEntity = await this.tenantRepository.findById(tenant.tenantId);

    if (!tenantEntity) {
      throw new NotFoundError(
        `Tenant '${tenant.tenantId}' tidak ditemukan dalam penyimpanan.`,
        { code: "TENANT_NOT_FOUND" },
      );
    }

    // Enforce tenant status
    TenantRules.assertCanAccess(tenantEntity.status, tenantEntity.slug);

    const cred = await this.credentialRepository.getByTenantId(tenant.tenantId);
    if (!cred?.encryptedToken) {
      throw new InfrastructureError(
        `Credential Moodle untuk tenant '${tenantEntity.slug}' belum dikonfigurasi.`,
        { code: "TENANT_CREDENTIAL_NOT_CONFIGURED" },
      );
    }

    const decryptedToken = this.encryptionProvider.decrypt({
      encryptedValue: cred.encryptedToken,
      iv: cred.iv,
      authTag: cred.authTag,
      keyVersion: cred.keyVersion,
    });

    return {
      baseUrl: tenantEntity.moodleBaseUrl,
      token: decryptedToken,
    };
  }
}
