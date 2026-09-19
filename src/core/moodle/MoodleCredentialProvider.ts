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
    tenant: TenantContext,
  ): Promise<MoodleCredentials> {
    return {
      url: tenant.moodleUrl,
      token: tenant.moodleToken,
    };
  }
}
