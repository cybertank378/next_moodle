import "server-only";

import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import type {
  LoginTenant,
  MoodleAuthProvider,
  MoodleLoginResult,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

interface MoodleTokenResponse {
  readonly token?: string;
  readonly error?: string;
}

interface MoodleSiteInfoResponse {
  readonly userid?: number;
  readonly username?: string;
  readonly fullname?: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly useremail?: string;
}

export class MoodleStudentAuthProvider implements MoodleAuthProvider {
  async authenticateStudent(input: {
    readonly tenant: LoginTenant;
    readonly username: string;
    readonly password: string;
  }): Promise<MoodleLoginResult> {
    const token = await this.requestToken(input);
    const client = new MoodleRestClient({
      baseUrl: input.tenant.moodleUrl,
      token,
    });
    const siteInfo = await client.call<MoodleSiteInfoResponse>(
      "core_webservice_get_site_info",
      {},
      { requestKind: "safe-read" },
    );

    if (!siteInfo.userid || !siteInfo.username) {
      throw new InfrastructureError("Moodle site info response is incomplete.");
    }

    return {
      token,
      siteInfo: {
        userId: siteInfo.userid,
        username: siteInfo.username,
        fullName:
          siteInfo.fullname ||
          [siteInfo.firstname, siteInfo.lastname].filter(Boolean).join(" "),
        email: siteInfo.useremail,
      },
    };
  }

  private async requestToken(input: {
    readonly tenant: LoginTenant;
    readonly username: string;
    readonly password: string;
  }): Promise<string> {
    const url = new URL("/login/token.php", input.tenant.moodleUrl);
    const body = new URLSearchParams({
      username: input.username,
      password: input.password,
      service: "nextjs_student",
    });
    const response = await fetch(url, {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    const payload = (await response.json()) as MoodleTokenResponse;
    if (!response.ok || !payload.token) {
      throw new UnauthorizedError(payload.error || "Login Moodle gagal.");
    }
    return payload.token;
  }
}
