import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import type {
  IMoodleClient,
  LoginTenant,
  MoodleLoginResult,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

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
        input.service,
      );
      return { ...result, serviceUsed: input.service };
    }

    // Explicit override for admin to skip capability probing
    if (input.username === "admin") {
      const adminToken = await MoodleRestClient.authenticate(
        input.tenant.moodleUrl,
        input.username,
        input.password,
        10000,
        "nextjs_admin",
      );

      // Attempt to fetch capabilities if possible, but don't fail if it doesn't work
      let caps: Record<string, unknown> = {};
      try {
        const client = new MoodleRestClient({
          baseUrl: input.tenant.moodleUrl,
          token: adminToken.token,
          timeoutMs: 10000,
        });
        caps = await client.call<Record<string, unknown>>(
          "local_examapi_get_capabilities",
          {},
        );
      } catch (_e) {
        // ignore capability fetch errors for hardcoded admin
      }
      return { ...adminToken, serviceUsed: "nextjs_admin", capabilities: caps };
    }

    const usernameLower = input.username.toLowerCase();
    const isTeacherUsername =
      usernameLower.startsWith("teacher") ||
      usernameLower.startsWith("guru") ||
      usernameLower.startsWith("pengajar") ||
      usernameLower.includes("teacher");

    // Step 1: Request token for nextjs_student to test capabilities safely
    const probeToken = await MoodleRestClient.authenticate(
      input.tenant.moodleUrl,
      input.username,
      input.password,
      10000,
      "nextjs_student",
    );

    // Step 2: Determine role via capabilities or username heuristics
    try {
      const client = new MoodleRestClient({
        baseUrl: input.tenant.moodleUrl,
        token: probeToken.token,
        timeoutMs: 10000,
      });
      const caps = await client.call<Record<string, unknown>>(
        "local_examapi_get_capabilities",
        {},
      );

      const isTeacherOrManager =
        isTeacherUsername ||
        Boolean(
          caps &&
            (caps.can_manage ||
              caps.can_manage_questions ||
              caps.can_manage_quizzes ||
              caps.can_view_reports),
        );

      if (isTeacherOrManager) {
        // Try authenticating with nextjs_admin if Moodle allows it for this staff account
        try {
          const adminToken = await MoodleRestClient.authenticate(
            input.tenant.moodleUrl,
            input.username,
            input.password,
            10000,
            "nextjs_admin",
          );
          return {
            ...adminToken,
            serviceUsed: "nextjs_admin",
            capabilities: caps,
          };
        } catch {
          // If nextjs_admin service is restricted in Moodle for teachers,
          // preserve teacher/tenant role with probeToken
          return {
            ...probeToken,
            serviceUsed: "nextjs_tenant",
            capabilities: caps,
          };
        }
      }

      if (caps && (caps.can_monitor || caps.can_manage_attempts)) {
        try {
          const proctorToken = await MoodleRestClient.authenticate(
            input.tenant.moodleUrl,
            input.username,
            input.password,
            10000,
            "nextjs_proctor",
          );
          return {
            ...proctorToken,
            serviceUsed: "nextjs_proctor",
            capabilities: caps,
          };
        } catch {
          return {
            ...probeToken,
            serviceUsed: "nextjs_proctor",
            capabilities: caps,
          };
        }
      }

      return {
        ...probeToken,
        serviceUsed: "nextjs_student",
        capabilities: caps,
      };
    } catch (_e) {
      if (isTeacherUsername) {
        return { ...probeToken, serviceUsed: "nextjs_tenant" };
      }
      return { ...probeToken, serviceUsed: "nextjs_student" };
    }
  }
}
