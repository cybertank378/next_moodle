import "server-only";

import { NotFoundError } from "@/core/errors/NotFoundError";
import { SecurityError } from "@/core/errors/SecurityError";
import type { TenantEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { SsrfValidator } from "@/core/security/SsrfValidator";
import {
  type TenantContext,
  validateTenantContext,
} from "@/core/tenant/TenantContext";
import type { MoodleCredentials } from "./types";

export type MoodleServiceCredential = "admin" | "proctor";

export interface EncryptedMoodleCredentialRecord {
  tenantId: string;
  moodleUrl: string;
  encryptedAdminToken: string;
  encryptedProctorToken: string | null;
  timeoutBudgetMs: number;
  sslVerify: boolean;
}

export interface MoodleCredentialStore {
  findByTenantId(
    tenantId: string,
  ): Promise<EncryptedMoodleCredentialRecord | null>;
}

export interface MoodleCredentialProvider {
  getCredentials(
    tenant: TenantContext,
    service: MoodleServiceCredential,
  ): Promise<MoodleCredentials>;
}

export class EncryptedMoodleCredentialProvider
  implements MoodleCredentialProvider
{
  constructor(
    private readonly store: MoodleCredentialStore,
    private readonly encryption: TenantEncryptionProvider,
    private readonly ssrfValidator = new SsrfValidator(),
  ) {}

  async getCredentials(
    tenantInput: TenantContext,
    service: MoodleServiceCredential,
  ): Promise<MoodleCredentials> {
    const tenant = validateTenantContext(tenantInput);
    const record = await this.store.findByTenantId(tenant.tenantId);

    if (!record) {
      throw new NotFoundError("Tenant Moodle credentials were not found.");
    }
    if (record.tenantId !== tenant.tenantId) {
      throw new SecurityError("Tenant credential isolation check failed.");
    }

    this.ssrfValidator.validateUrl(record.moodleUrl);
    const encryptedToken =
      service === "admin"
        ? record.encryptedAdminToken
        : record.encryptedProctorToken;
    if (!encryptedToken) {
      throw new NotFoundError(
        `Tenant Moodle ${service} credentials were not found.`,
      );
    }

    const token = await this.encryption.decrypt(
      encryptedToken,
      tenant.tenantId,
    );

    return {
      baseUrl: record.moodleUrl,
      token,
      timeoutMs: record.timeoutBudgetMs,
      sslVerify: record.sslVerify,
    };
  }
}
