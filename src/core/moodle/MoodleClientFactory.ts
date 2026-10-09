import type {
  MoodleCredentialProvider,
  MoodleServiceCredential,
} from "@/core/moodle/MoodleCredentialProvider";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import type { MoodleCredentials } from "@/core/moodle/types";
import {
  type TenantContext,
  validateTenantContext,
} from "@/core/tenant/TenantContext";

export interface MoodleClientFactory {
  createClient(credentials: MoodleCredentials): MoodleRestClient;
  createClientForTenant(
    tenant: TenantContext,
    service: MoodleServiceCredential,
  ): Promise<MoodleRestClient>;
  createClientForUser(
    tenant: TenantContext,
    userToken: string,
  ): Promise<MoodleRestClient>;
}

export class DefaultMoodleClientFactory implements MoodleClientFactory {
  constructor(private readonly credentialProvider?: MoodleCredentialProvider) {}

  createClient(credentials: MoodleCredentials): MoodleRestClient {
    return new MoodleRestClient(credentials);
  }

  async createClientForTenant(
    tenantInput: TenantContext,
    service: MoodleServiceCredential,
  ): Promise<MoodleRestClient> {
    if (!this.credentialProvider) {
      throw new Error(
        "MoodleCredentialProvider is required to create a client for a tenant",
      );
    }

    const tenant = validateTenantContext(tenantInput);
    const credentials = await this.credentialProvider.getCredentials(
      tenant,
      service,
    );
    return this.createClient(credentials);
  }

  async createClientForUser(
    tenantInput: TenantContext,
    userToken: string,
  ): Promise<MoodleRestClient> {
    if (!this.credentialProvider) {
      throw new Error(
        "MoodleCredentialProvider is required to create a client for a tenant",
      );
    }

    const tenant = validateTenantContext(tenantInput);
    const credentials = await this.credentialProvider.getCredentials(
      tenant,
      "admin",
    );
    return this.createClient({
      baseUrl: credentials.baseUrl,
      token: userToken,
      timeoutMs: credentials.timeoutMs,
      sslVerify: credentials.sslVerify,
    });
  }
}
