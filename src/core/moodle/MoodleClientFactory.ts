import {
  type TenantContext,
  validateTenantContext,
} from "@/core/tenant/TenantContext";
import type {
  MoodleCredentialProvider,
  MoodleServiceCredential,
} from "./MoodleCredentialProvider";
import { MoodleRestClient } from "./MoodleRestClient";
import type { MoodleCredentials } from "./types";

export interface MoodleClientFactory {
  createClient(credentials: MoodleCredentials): MoodleRestClient;
  createClientForTenant(
    tenant: TenantContext,
    service: MoodleServiceCredential,
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
}
