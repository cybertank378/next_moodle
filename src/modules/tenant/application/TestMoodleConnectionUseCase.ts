import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import {
  type SsrfValidator,
  ssrfValidator,
} from "@/core/security/SsrfValidator";

export interface MoodleConnectionInput {
  moodleUrl: string;
  adminToken: string;
  proctorToken?: string | null;
  timeoutBudgetMs?: number;
  sslVerify?: boolean;
}

export interface MoodleConnectionDiagnostic {
  connected: boolean;
  latencyMs: number;
  siteInfo?: {
    siteName: string;
    moodleRelease: string;
    siteUrl: string;
  };
  adminTokenValid: boolean;
  proctorTokenValid?: boolean;
  pluginStatus?: {
    installed: boolean;
    version?: string;
  };
  error?: string;
}

interface SiteInfoRawResponse {
  sitename?: string;
  release?: string;
  siteurl?: string;
  version?: string;
  [key: string]: unknown;
}

interface PluginStatusRawResponse {
  status?: string;
  version?: string;
  [key: string]: unknown;
}

/**
 * Use case to test and validate Moodle connection, credentials, latency,
 * and plugin availability without leaking sensitive tokens or passwords.
 */
export class TestMoodleConnectionUseCase {
  constructor(
    private readonly moodleClientFactory: MoodleClientFactory,
    private readonly validator: SsrfValidator = ssrfValidator,
  ) {}

  async execute(
    input: MoodleConnectionInput,
  ): Promise<MoodleConnectionDiagnostic> {
    // 1. SSRF validation check
    try {
      this.validator.validateUrl(input.moodleUrl);
    } catch (err) {
      return {
        connected: false,
        latencyMs: 0,
        adminTokenValid: false,
        error: err instanceof Error ? err.message : "SSRF validation failed",
      };
    }

    // 2. Admin Token & Connectivity Test
    const adminClient = this.moodleClientFactory.createClient({
      baseUrl: input.moodleUrl,
      moodleUrl: input.moodleUrl,
      token: input.adminToken,
      timeoutMs: input.timeoutBudgetMs ?? 10000,
      sslVerify: input.sslVerify ?? true,
    });

    const startTime = Date.now();
    let siteInfoPayload: SiteInfoRawResponse;

    try {
      siteInfoPayload = await adminClient.call<SiteInfoRawResponse>(
        "core_webservice_get_site_info",
      );
    } catch {
      return {
        connected: false,
        latencyMs: Date.now() - startTime,
        adminTokenValid: false,
        error: "Failed to authenticate or connect with Moodle admin token",
      };
    }

    const latencyMs = Date.now() - startTime;

    // 3. Proctor Token Validation (if provided)
    let proctorTokenValid: boolean | undefined;
    if (input.proctorToken && input.proctorToken.trim().length > 0) {
      const proctorClient = this.moodleClientFactory.createClient({
        baseUrl: input.moodleUrl,
        moodleUrl: input.moodleUrl,
        token: input.proctorToken,
        timeoutMs: input.timeoutBudgetMs ?? 5000,
        sslVerify: input.sslVerify ?? true,
      });

      try {
        await proctorClient.call<SiteInfoRawResponse>(
          "core_webservice_get_site_info",
        );
        proctorTokenValid = true;
      } catch {
        proctorTokenValid = false;
      }
    }

    // 4. Plugin Health Test (local_examapi)
    let pluginStatus: { installed: boolean; version?: string } = {
      installed: false,
    };

    try {
      const pluginRes = await adminClient.call<PluginStatusRawResponse>(
        "local_examapi_get_system_status",
      );
      pluginStatus = {
        installed: true,
        version:
          pluginRes && typeof pluginRes.version === "string"
            ? pluginRes.version
            : "installed",
      };
    } catch {
      pluginStatus = { installed: false };
    }

    // 5. Construct Safe Diagnostic Output (Zero token / secret leakage)
    return {
      connected: true,
      latencyMs,
      adminTokenValid: true,
      proctorTokenValid,
      siteInfo: {
        siteName: siteInfoPayload.sitename ?? "Moodle",
        moodleRelease: siteInfoPayload.release ?? "Unknown",
        siteUrl: siteInfoPayload.siteurl ?? input.moodleUrl,
      },
      pluginStatus,
    };
  }
}
