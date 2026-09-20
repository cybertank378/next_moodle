import { describe, expect, it } from "vitest";
import {
  DefaultMoodleCredentialProvider,
  type MoodleCredentialProvider,
} from "@/core/moodle/MoodleCredentialProvider";
import type { TenantContext } from "@/core/tenant/TenantContext";

describe("MoodleCredentialProvider", () => {
  const tenantA: TenantContext = {
    tenantId: "tenant_a",
    slug: "tenant-a",
    status: "ACTIVE",
  };

  it("should implement MoodleCredentialProvider interface", async () => {
    const provider: MoodleCredentialProvider =
      new DefaultMoodleCredentialProvider();

    const creds = await provider.getCredential(tenantA);
    expect(creds).toBeDefined();
    expect(creds.baseUrl).toBeDefined();
    expect(typeof creds.baseUrl).toBe("string");
    expect(creds.token).toBeDefined();
    expect(typeof creds.token).toBe("string");
  });

  it("should support custom in-memory multi-tenant credential provider", async () => {
    const customProvider: MoodleCredentialProvider = {
      getCredential: async (tenant) => {
        if (tenant.tenantId === "tenant_a") {
          return {
            baseUrl: "https://moodle-a.example.test",
            token: "token_a_123",
          };
        }
        if (tenant.tenantId === "tenant_b") {
          return {
            baseUrl: "https://moodle-b.example.test",
            token: "token_b_456",
          };
        }
        throw new Error(`Tenant not found: ${tenant.tenantId}`);
      },
    };

    const credA = await customProvider.getCredential(tenantA);
    expect(credA.baseUrl).toBe("https://moodle-a.example.test");
    expect(credA.token).toBe("token_a_123");

    const credB = await customProvider.getCredential({
      tenantId: "tenant_b",
      slug: "tenant-b",
      status: "ACTIVE",
    });
    expect(credB.baseUrl).toBe("https://moodle-b.example.test");
    expect(credB.token).toBe("token_b_456");
  });
});
