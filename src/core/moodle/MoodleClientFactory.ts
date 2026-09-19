import "server-only";
import type { ILogger } from "../logger";
import type { TenantContext } from "../tenant/TenantContext";
import {
  DefaultMoodleCredentialProvider,
  type IMoodleCredentialProvider,
} from "./MoodleCredentialProvider";
import { MoodleRestClient } from "./MoodleRestClient";

export class MoodleClientFactory {
  private static readonly instances = new Map<string, MoodleRestClient>();

  constructor(
    private readonly credentialProvider: IMoodleCredentialProvider = new DefaultMoodleCredentialProvider(),
  ) {}

  public async getClientForTenant(
    tenant: TenantContext,
    logger?: ILogger,
  ): Promise<MoodleRestClient> {
    const cacheKey = `${tenant.tenantId}:${tenant.moodleUrl}`;
    const existing = MoodleClientFactory.instances.get(cacheKey);

    if (existing) {
      return existing;
    }

    const creds = await this.credentialProvider.getCredentialsForTenant(tenant);
    const client = new MoodleRestClient({
      baseUrl: creds.url,
      token: creds.token,
      logger,
    });

    MoodleClientFactory.instances.set(cacheKey, client);
    return client;
  }
}

export const moodleClientFactory = new MoodleClientFactory();
