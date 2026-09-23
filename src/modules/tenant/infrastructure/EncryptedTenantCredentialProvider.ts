import { NotFoundError } from "@/core/errors/NotFoundError";
import type {
  MoodleCredentialProvider,
  MoodleServiceCredential,
} from "@/core/moodle/MoodleCredentialProvider";
import type { MoodleCredentials } from "@/core/moodle/types";
import type { TenantEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import {
  type SsrfValidator,
  ssrfValidator,
} from "@/core/security/SsrfValidator";
import {
  type TenantContext,
  validateTenantContext,
} from "@/core/tenant/TenantContext";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";

export interface RawCredentialsToEncrypt {
  adminToken: string;
  proctorToken?: string | null;
}

export interface EncryptedCredentialResult {
  encryptedAdminToken: string;
  encryptedProctorToken: string | null;
}

/**
 * Resolves and decrypts Moodle credentials for a tenant, enforcing
 * cryptographic tenant isolation (via HKDF) and SSRF protection.
 */
export class EncryptedTenantCredentialProvider
  implements MoodleCredentialProvider
{
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly encryptionProvider: TenantEncryptionProvider,
    private readonly validator: SsrfValidator = ssrfValidator,
  ) {}

  /**
   * Retrieves decrypted Moodle credentials for the specified tenantId.
   */
  async getCredentials(
    tenantInput: string | TenantContext,
    service: MoodleServiceCredential = "admin",
  ): Promise<MoodleCredentials> {
    const tenantId =
      typeof tenantInput === "string"
        ? tenantInput
        : validateTenantContext(tenantInput).tenantId;
    const tenant = await this.tenantRepository.findById(tenantId);

    if (!tenant?.credential) {
      throw new NotFoundError("Tenant credentials not found", { tenantId });
    }

    const { credential } = tenant;

    // Validate moodleUrl against SSRF attacks before returning credentials
    this.validator.validateUrl(credential.moodleUrl);

    // Decrypt admin token with tenant-specific key
    const adminToken = await this.encryptionProvider.decrypt(
      credential.encryptedAdminToken,
      tenantId,
    );

    // Decrypt proctor token if present
    let proctorToken: string | undefined;
    if (credential.encryptedProctorToken) {
      proctorToken = await this.encryptionProvider.decrypt(
        credential.encryptedProctorToken,
        tenantId,
      );
    }

    if (service === "proctor" && !proctorToken) {
      throw new NotFoundError("Tenant proctor credentials not found", {
        tenantId,
      });
    }

    return {
      baseUrl: credential.moodleUrl,
      moodleUrl: credential.moodleUrl,
      token: service === "proctor" ? (proctorToken as string) : adminToken,
      proctorToken,
      timeoutMs: credential.timeoutBudgetMs,
      sslVerify: credential.sslVerify,
    };
  }

  /**
   * Helper to encrypt raw credentials prior to saving into the database.
   */
  async encryptCredentials(
    tenantId: string,
    raw: RawCredentialsToEncrypt,
  ): Promise<EncryptedCredentialResult> {
    const encryptedAdminToken = await this.encryptionProvider.encrypt(
      raw.adminToken,
      tenantId,
    );

    let encryptedProctorToken: string | null = null;
    if (raw.proctorToken && raw.proctorToken.trim().length > 0) {
      encryptedProctorToken = await this.encryptionProvider.encrypt(
        raw.proctorToken,
        tenantId,
      );
    }

    return {
      encryptedAdminToken,
      encryptedProctorToken,
    };
  }
}
