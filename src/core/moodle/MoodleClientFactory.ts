import type { MoodleCredentialProvider } from "./MoodleCredentialProvider";
import { MoodleRestClient } from "./MoodleRestClient";
import type { MoodleCredentials } from "./types";

export interface MoodleClientFactory {
  createClient(credentials: MoodleCredentials): MoodleRestClient;
  createClientForTenant(tenantId: string): Promise<MoodleRestClient>;
}

export class DefaultMoodleClientFactory implements MoodleClientFactory {
  constructor(private readonly credentialProvider?: MoodleCredentialProvider) {}

  createClient(credentials: MoodleCredentials): MoodleRestClient {
    return new MoodleRestClient(credentials);
  }

  async createClientForTenant(tenantId: string): Promise<MoodleRestClient> {
    if (!this.credentialProvider) {
      throw new Error(
        "MoodleCredentialProvider is required to create a client for a tenant",
      );
    }

    const credentials = await this.credentialProvider.getCredentials(tenantId);
    return this.createClient(credentials);
  }
}
