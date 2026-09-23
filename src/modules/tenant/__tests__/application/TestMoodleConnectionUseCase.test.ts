import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import { SsrfValidator } from "@/core/security/SsrfValidator";
import {
  type MoodleConnectionInput,
  TestMoodleConnectionUseCase,
} from "@/modules/tenant/application/TestMoodleConnectionUseCase";

describe("TestMoodleConnectionUseCase", () => {
  const createMockClientFactory = (
    adminResponse: unknown,
    proctorResponse?: unknown,
    pluginResponse?: unknown,
  ) => {
    const mockClient = {
      call: vi.fn().mockImplementation((wsfunction: string) => {
        if (wsfunction === "core_webservice_get_site_info") {
          return Promise.resolve(adminResponse);
        }
        if (wsfunction === "local_examapi_get_health") {
          if (pluginResponse instanceof Error) {
            return Promise.reject(pluginResponse);
          }
          return Promise.resolve(
            pluginResponse ?? {
              status: "ok",
              component: "local_examapi",
              apiversion: 1,
              pluginversion: 2026092101,
            },
          );
        }
        return Promise.resolve({});
      }),
    } as unknown as MoodleRestClient;

    const mockProctorClient = {
      call: vi.fn().mockImplementation(() => {
        if (proctorResponse instanceof Error) {
          return Promise.reject(proctorResponse);
        }
        return Promise.resolve(proctorResponse ?? { sitename: "Test Moodle" });
      }),
    } as unknown as MoodleRestClient;

    const factory: MoodleClientFactory = {
      createClient: vi.fn().mockImplementation((credentials) => {
        if (credentials.token === "proctor-token-abc") {
          return mockProctorClient;
        }
        return mockClient;
      }),
      createClientForTenant: vi.fn().mockResolvedValue(mockClient),
    };

    return { factory, mockClient, mockProctorClient };
  };

  it("should return successful diagnostic when connection and admin token are valid", async () => {
    const siteInfo = {
      sitename: "Universitas Digital",
      release: "4.5.1+ (Build: 20250110)",
      siteurl: "https://moodle.univ.edu",
    };

    const { factory } = createMockClientFactory(siteInfo);
    const useCase = new TestMoodleConnectionUseCase(
      factory,
      new SsrfValidator(),
    );

    const input: MoodleConnectionInput = {
      moodleUrl: "https://moodle.univ.edu",
      adminToken: "valid-admin-token",
    };

    const result = await useCase.execute(input);

    expect(result.connected).toBe(true);
    expect(result.adminTokenValid).toBe(true);
    expect(result.siteInfo?.siteName).toBe("Universitas Digital");
    expect(result.siteInfo?.moodleRelease).toBe("4.5.1+ (Build: 20250110)");
    expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    expect(result.pluginStatus?.installed).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it("should validate proctor token when provided", async () => {
    const siteInfo = {
      sitename: "Universitas Digital",
      release: "4.5",
      siteurl: "https://moodle.univ.edu",
    };

    const { factory } = createMockClientFactory(siteInfo, { sitename: "OK" });
    const useCase = new TestMoodleConnectionUseCase(
      factory,
      new SsrfValidator(),
    );

    const input: MoodleConnectionInput = {
      moodleUrl: "https://moodle.univ.edu",
      adminToken: "valid-admin-token",
      proctorToken: "proctor-token-abc",
    };

    const result = await useCase.execute(input);

    expect(result.connected).toBe(true);
    expect(result.adminTokenValid).toBe(true);
    expect(result.proctorTokenValid).toBe(true);
  });

  it("should report invalid token when Moodle throws invalidtoken error", async () => {
    const mockClient = {
      call: vi.fn().mockRejectedValue(new Error("Invalid token")),
    } as unknown as MoodleRestClient;

    const factory: MoodleClientFactory = {
      createClient: vi.fn().mockReturnValue(mockClient),
      createClientForTenant: vi.fn().mockResolvedValue(mockClient),
    };

    const useCase = new TestMoodleConnectionUseCase(
      factory,
      new SsrfValidator(),
    );

    const input: MoodleConnectionInput = {
      moodleUrl: "https://moodle.univ.edu",
      adminToken: "invalid-token",
    };

    const result = await useCase.execute(input);

    expect(result.connected).toBe(false);
    expect(result.adminTokenValid).toBe(false);
    expect(result.error).toBeDefined();
    // Verify tokens are NEVER in error message
    expect(result.error).not.toContain("invalid-token");
  });

  it("should reject SSRF restricted moodleUrl without attempting network calls", async () => {
    const { factory } = createMockClientFactory({});
    const useCase = new TestMoodleConnectionUseCase(
      factory,
      new SsrfValidator(),
    );

    const input: MoodleConnectionInput = {
      moodleUrl: "http://127.0.0.1:8080/moodle",
      adminToken: "some-token",
    };

    const result = await useCase.execute(input);

    expect(result.connected).toBe(false);
    expect(result.adminTokenValid).toBe(false);
    expect(result.error).toMatch(/SSRF/i);
    expect(factory.createClient).not.toHaveBeenCalled();
  });

  it("should handle optional plugin not installed gracefully", async () => {
    const siteInfo = {
      sitename: "Moodle School",
      release: "4.4",
      siteurl: "https://moodle.school.edu",
    };

    const pluginError = new Error("Coding error: function does not exist");
    const { factory } = createMockClientFactory(
      siteInfo,
      undefined,
      pluginError,
    );

    const useCase = new TestMoodleConnectionUseCase(
      factory,
      new SsrfValidator(),
    );

    const input: MoodleConnectionInput = {
      moodleUrl: "https://moodle.school.edu",
      adminToken: "admin-token",
    };

    const result = await useCase.execute(input);

    expect(result.connected).toBe(true);
    expect(result.adminTokenValid).toBe(true);
    expect(result.pluginStatus?.installed).toBe(false);
  });
});
