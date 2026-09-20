import "server-only";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import type { ILogger } from "@/core/logger";
import type { TenantContext } from "@/core/tenant/TenantContext";
import {
  DefaultMoodleCredentialProvider,
  type MoodleCredentialProvider,
} from "./MoodleCredentialProvider";
import { MoodleRestClient } from "./MoodleRestClient";

export interface CreateMoodleClientOptions {
  readonly tenant: TenantContext;
  readonly requestId?: string;
  readonly logger?: ILogger;
}

export class MoodleClientFactory {
  constructor(
    private readonly credentialProvider: MoodleCredentialProvider = new DefaultMoodleCredentialProvider(),
  ) {}

  public async create(
    options: CreateMoodleClientOptions,
  ): Promise<MoodleRestClient> {
    try {
      const getCredMethod =
        this.credentialProvider.getCredential ??
        (
          this.credentialProvider as unknown as {
            getCredentialsForTenant: (
              t: TenantContext,
            ) => Promise<{ baseUrl?: string; url?: string; token: string }>;
          }
        ).getCredentialsForTenant;

      const creds = await getCredMethod.call(
        this.credentialProvider,
        options.tenant,
      );

      const baseUrl = creds.baseUrl ?? (creds as { url?: string }).url;
      if (!baseUrl || !creds.token) {
        throw new Error(
          `Incomplete Moodle credentials for tenant ${options.tenant.tenantId}`,
        );
      }

      return new MoodleRestClient({
        baseUrl,
        token: creds.token,
        tenantId: options.tenant.tenantId,
        requestId: options.requestId,
        logger: options.logger,
      });
    } catch (error) {
      if (error instanceof InfrastructureError) {
        throw error;
      }
      throw new InfrastructureError(
        `Failed to resolve credentials or instantiate Moodle client for tenant ${options.tenant.tenantId}: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      );
    }
  }

  public async getClientForTenant(
    tenant: TenantContext,
    logger?: ILogger,
  ): Promise<MoodleRestClient> {
    return this.create({ tenant, logger });
  }
}

export const moodleClientFactory = new MoodleClientFactory();
