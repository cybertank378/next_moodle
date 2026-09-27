import {
  IMoodleClient,
  LoginTenant,
  MoodleLoginResult,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";

export class MoodleDynamicAuthenticator implements IMoodleClient {
  async authenticateStudent(input: {
    tenant: LoginTenant;
    username: string;
    password: string;
    service?: string;
  }): Promise<MoodleLoginResult> {
    if (input.service) {
      const result = await MoodleRestClient.authenticate(
        input.tenant.moodleUrl,
        input.username,
        input.password,
        10000,
        input.service
      );
      return { ...result, serviceUsed: input.service };
    }

    // Explicit override for admin to skip capability probing
    if (input.username === 'admin') {
      const adminToken = await MoodleRestClient.authenticate(
        input.tenant.moodleUrl,
        input.username,
        input.password,
        10000,
        "nextjs_admin"
      );
      
      // Attempt to fetch capabilities if possible, but don't fail if it doesn't work
      let caps = {};
      try {
        const client = new MoodleRestClient({
           baseUrl: input.tenant.moodleUrl,
           token: adminToken.token,
           timeoutMs: 10000
        });
        caps = await client.call<any>("local_examapi_get_capabilities", {});
      } catch (e) {
        // ignore capability fetch errors for hardcoded admin
      }
      return { ...adminToken, serviceUsed: "nextjs_admin", capabilities: caps };
    }

    // Step 1: Request token for nextjs_student to test capabilities safely
    const probeToken = await MoodleRestClient.authenticate(
      input.tenant.moodleUrl,
      input.username,
      input.password,
      10000,
      "nextjs_student"
    );

    // Step 2: Determine role via capabilities
    try {
      const client = new MoodleRestClient({
         baseUrl: input.tenant.moodleUrl,
         token: probeToken.token,
         timeoutMs: 10000
      });
      const caps = await client.call<any>("local_examapi_get_capabilities", {});
      
      let finalSvc = "nextjs_student";
      
      if (caps.can_manage || caps.can_view_reports) {
         finalSvc = "nextjs_tenant";
      } else if (caps.can_monitor || caps.can_manage_attempts) {
         finalSvc = "nextjs_proctor";
      }

      if (finalSvc === "nextjs_student") {
         return { ...probeToken, serviceUsed: finalSvc, capabilities: caps };
      }
      
      // Re-authenticate with the correctly inferred service
      const finalToken = await MoodleRestClient.authenticate(
         input.tenant.moodleUrl, input.username, input.password, 10000, finalSvc
      );
      return { ...finalToken, serviceUsed: finalSvc, capabilities: caps };
    } catch (e) {
      // If capabilities fail, fallback to student
      return { ...probeToken, serviceUsed: "nextjs_student" };
    }
  }
}
