import "server-only";
import type { TenantContext } from "../tenant/TenantContext";

export interface MoodleCredentials {
  readonly url: string;
  readonly token: string;
}

export interface IMoodleCredentialProvider {
  getCredentialsForTenant(tenant: TenantContext): Promise<MoodleCredentials>;
}

export class DefaultMoodleCredentialProvider
  implements IMoodleCredentialProvider
{
  public async getCredentialsForTenant(
    _tenant: TenantContext,
  ): Promise<MoodleCredentials> {
    return {
      url: process.env.DEFAULT_MOODLE_URL || "https://moodle.example.com",
      token: process.env.DEFAULT_MOODLE_TOKEN || "mock_token",
    };
  }
}
