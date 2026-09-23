import { describe, expect, it, vi } from "vitest";
import { DefaultMoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleCredentialProvider } from "@/core/moodle/MoodleCredentialProvider";

describe("DefaultMoodleClientFactory", () => {
  it("requires a validated tenant context before resolving credentials", async () => {
    const provider: MoodleCredentialProvider = {
      getCredentials: vi.fn().mockResolvedValue({
        baseUrl: "https://moodle.example.edu",
        token: "admin-token",
        sslVerify: true,
      }),
    };
    const factory = new DefaultMoodleClientFactory(provider);

    await expect(
      factory.createClientForTenant(
        { tenantId: "", tenantSlug: "tenant", status: "ACTIVE" },
        "admin",
      ),
    ).rejects.toThrow(/tenantId/i);
    expect(provider.getCredentials).not.toHaveBeenCalled();
  });

  it("forwards the validated tenant context and server-selected service", async () => {
    const provider: MoodleCredentialProvider = {
      getCredentials: vi.fn().mockResolvedValue({
        baseUrl: "https://moodle.example.edu",
        token: "proctor-token",
        sslVerify: true,
      }),
    };
    const factory = new DefaultMoodleClientFactory(provider);
    const tenant = {
      tenantId: "tenant-a",
      tenantSlug: "tenant-a",
      status: "ACTIVE" as const,
    };

    await factory.createClientForTenant(tenant, "proctor");

    expect(provider.getCredentials).toHaveBeenCalledWith(tenant, "proctor");
  });
});
