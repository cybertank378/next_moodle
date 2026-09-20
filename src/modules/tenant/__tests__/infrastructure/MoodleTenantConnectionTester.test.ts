import { describe, expect, it, vi } from "vitest";
import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import { MoodleTenantConnectionTester } from "@/modules/tenant/infrastructure/providers/MoodleTenantConnectionTester";

describe("MoodleTenantConnectionTester", () => {
  const tenant = new Tenant({
    id: "tenant-test",
    slug: "school-test",
    name: "School Test",
    status: "ACTIVE",
    moodleBaseUrl: "https://moodle.test",
  });

  it("should return success when core_webservice_get_site_info succeeds", async () => {
    const mockClient = {
      call: vi.fn().mockResolvedValue({
        sitename: "Moodle Test Campus",
        version: "2023100900",
        release: "4.3+ (Build: 20231012)",
      }),
    } as unknown as MoodleRestClient;

    const mockFactory = {
      create: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;

    const tester = new MoodleTenantConnectionTester(mockFactory);
    const result = await tester.testConnection(tenant);

    expect(result.success).toBe(true);
    expect(result.siteName).toBe("Moodle Test Campus");
    expect(result.moodleVersion).toBe("4.3+ (Build: 20231012)");
    expect(result.message).toContain("berhasil");
  });

  it("should return sanitized failure if invalid token error occurs", async () => {
    const mockClient = {
      call: vi.fn().mockRejectedValue(
        new MoodleError({
          message: "Token invalid",
          code: "MOODLE_INVALID_TOKEN",
          statusCode: 401,
          moodleErrorCode: "invalidtoken",
        }),
      ),
    } as unknown as MoodleRestClient;

    const mockFactory = {
      create: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;

    const tester = new MoodleTenantConnectionTester(mockFactory);
    const result = await tester.testConnection(tenant);

    expect(result.success).toBe(false);
    expect(result.message).toContain(
      "Token atau credential Moodle tidak valid",
    );
  });

  it("should return sanitized failure on timeout", async () => {
    const mockClient = {
      call: vi.fn().mockRejectedValue(
        new MoodleError({
          message: "Timeout",
          code: "MOODLE_TIMEOUT",
          statusCode: 504,
        }),
      ),
    } as unknown as MoodleRestClient;

    const mockFactory = {
      create: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;

    const tester = new MoodleTenantConnectionTester(mockFactory);
    const result = await tester.testConnection(tenant);

    expect(result.success).toBe(false);
    expect(result.message).toContain("Waktu koneksi ke Moodle habis");
  });

  it("should return sanitized failure on network unreachable", async () => {
    const mockClient = {
      call: vi.fn().mockRejectedValue(
        new MoodleError({
          message: "Network unreachable",
          code: "MOODLE_NETWORK_ERROR",
          statusCode: 503,
        }),
      ),
    } as unknown as MoodleRestClient;

    const mockFactory = {
      create: vi.fn().mockResolvedValue(mockClient),
    } as unknown as MoodleClientFactory;

    const tester = new MoodleTenantConnectionTester(mockFactory);
    const result = await tester.testConnection(tenant);

    expect(result.success).toBe(false);
    expect(result.message).toContain("tidak dapat dijangkau");
  });
});
