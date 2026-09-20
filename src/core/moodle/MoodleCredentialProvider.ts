import "server-only";
import type { TenantContext } from "../tenant/TenantContext";
import type { MoodleCredential } from "./MoodleCredential";

export interface MoodleCredentialProvider {
  getCredential(tenant: TenantContext): Promise<MoodleCredential>;
}

// Aliases for backward compatibility
export type IMoodleCredentialProvider = MoodleCredentialProvider;
export type MoodleCredentials = MoodleCredential;

export class DefaultMoodleCredentialProvider
  implements MoodleCredentialProvider
{
  public async getCredential(
    _tenant: TenantContext,
  ): Promise<MoodleCredential> {
    return {
      baseUrl: process.env.DEFAULT_MOODLE_URL || "https://moodle.example.com",
      token: process.env.DEFAULT_MOODLE_TOKEN || "mock_token",
    };
  }

  public async getCredentialsForTenant(
    tenant: TenantContext,
  ): Promise<MoodleCredential> {
    return this.getCredential(tenant);
  }
}
