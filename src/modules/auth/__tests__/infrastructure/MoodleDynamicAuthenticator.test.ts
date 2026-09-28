import { beforeEach, describe, expect, it, vi } from "vitest";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import { MoodleDynamicAuthenticator } from "@/modules/auth/infrastructure/providers/MoodleDynamicAuthenticator";

// Mock the static MoodleRestClient.authenticate
vi.mock("@/core/moodle/MoodleRestClient", () => {
  const mockCall = vi.fn();
  return {
    MoodleRestClient: class {
      static authenticate = vi.fn();
      call = mockCall;
    },
    // Export mockCall so we can manipulate it in tests
    mockCall,
  };
});

describe("MoodleDynamicAuthenticator", () => {
  const authenticator = new MoodleDynamicAuthenticator();
  const mockTenant = {
    tenantId: "t1",
    slug: "acme",
    moodleUrl: "https://moodle.test",
    status: "ACTIVE" as const,
  };

  const input = {
    tenant: mockTenant,
    username: "user01",
    password: "pwd",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses provided service directly if specified", async () => {
    (MoodleRestClient.authenticate as any).mockResolvedValue({
      token: "token-123",
      siteInfo: {},
    });

    const result = await authenticator.authenticateStudent({
      ...input,
      service: "nextjs_student",
    });

    expect(MoodleRestClient.authenticate).toHaveBeenCalledWith(
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_student",
    );
    expect(result.serviceUsed).toBe("nextjs_student");
  });

  it("bypasses capability probe for admin user and uses nextjs_admin directly", async () => {
    (MoodleRestClient.authenticate as any).mockResolvedValueOnce({
      token: "admin-token",
      siteInfo: {},
    });

    const module = await import("@/core/moodle/MoodleRestClient");
    const { mockCall } = module as any;
    mockCall.mockResolvedValueOnce({ can_manage: true });

    const result = await authenticator.authenticateStudent({
      ...input,
      username: "admin",
    });

    expect(result.serviceUsed).toBe("nextjs_admin");
    expect(MoodleRestClient.authenticate).toHaveBeenCalledTimes(1);
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      1,
      "https://moodle.test",
      "admin",
      "pwd",
      10000,
      "nextjs_admin",
    );
  });

  it("maps to nextjs_tenant if can_manage is true for non-admin user", async () => {
    (MoodleRestClient.authenticate as any)
      .mockResolvedValueOnce({ token: "probe-token", siteInfo: {} })
      .mockResolvedValueOnce({ token: "tenant-token", siteInfo: {} });

    const module = await import("@/core/moodle/MoodleRestClient");
    const { mockCall } = module as any;
    mockCall.mockResolvedValueOnce({ can_manage: true });

    const result = await authenticator.authenticateStudent(input);

    expect(result.serviceUsed).toBe("nextjs_tenant");
    expect(MoodleRestClient.authenticate).toHaveBeenCalledTimes(2);
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      1,
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_student",
    );
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      2,
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_tenant",
    );
  });

  it("maps to nextjs_tenant if can_view_reports is true", async () => {
    (MoodleRestClient.authenticate as any)
      .mockResolvedValueOnce({ token: "probe-token", siteInfo: {} })
      .mockResolvedValueOnce({ token: "tenant-token", siteInfo: {} });

    const module = await import("@/core/moodle/MoodleRestClient");
    const { mockCall } = module as any;
    mockCall.mockResolvedValueOnce({ can_view_reports: true });

    const result = await authenticator.authenticateStudent(input);

    expect(result.serviceUsed).toBe("nextjs_tenant");
    expect(MoodleRestClient.authenticate).toHaveBeenCalledTimes(2);
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      2,
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_tenant",
    );
  });

  it("maps to nextjs_proctor if can_monitor or can_manage_attempts is true", async () => {
    (MoodleRestClient.authenticate as any)
      .mockResolvedValueOnce({ token: "probe-token", siteInfo: {} })
      .mockResolvedValueOnce({ token: "proctor-token", siteInfo: {} });

    const module = await import("@/core/moodle/MoodleRestClient");
    const { mockCall } = module as any;
    mockCall.mockResolvedValueOnce({ can_monitor: true });

    const result = await authenticator.authenticateStudent(input);

    expect(result.serviceUsed).toBe("nextjs_proctor");
    expect(MoodleRestClient.authenticate).toHaveBeenCalledTimes(2);
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      2,
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_proctor",
    );
  });

  it("maps to nextjs_student if capabilities do not grant higher privileges without re-authenticating", async () => {
    (MoodleRestClient.authenticate as any).mockResolvedValueOnce({
      token: "student-token",
      siteInfo: {},
    });

    const module = await import("@/core/moodle/MoodleRestClient");
    const { mockCall } = module as any;
    mockCall.mockResolvedValueOnce({
      can_manage: false,
      can_view_reports: false,
      can_monitor: false,
      can_manage_attempts: false,
    });

    const result = await authenticator.authenticateStudent(input);

    expect(result.serviceUsed).toBe("nextjs_student");
    expect(MoodleRestClient.authenticate).toHaveBeenCalledTimes(1);
    expect(MoodleRestClient.authenticate).toHaveBeenNthCalledWith(
      1,
      "https://moodle.test",
      "user01",
      "pwd",
      10000,
      "nextjs_student",
    );
  });
});
