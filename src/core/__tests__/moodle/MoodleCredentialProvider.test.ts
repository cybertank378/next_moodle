import { describe, expect, it, vi } from "vitest";
import {
  EncryptedMoodleCredentialProvider,
  type MoodleCredentialStore,
} from "@/core/moodle/MoodleCredentialProvider";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import type { TenantContext } from "@/core/tenant/TenantContext";

describe("EncryptedMoodleCredentialProvider", () => {
  const tenantA: TenantContext = {
    tenantId: "tenant-a",
    tenantSlug: "tenant-a",
    status: "ACTIVE",
  };
  const tenantB: TenantContext = {
    tenantId: "tenant-b",
    tenantSlug: "tenant-b",
    status: "ACTIVE",
  };
  const encryption = new AesHkdfEncryptionProvider(
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef",
  );

  it("selects and decrypts only the requested tenant service token", async () => {
    const admin = await encryption.encrypt("admin-a", tenantA.tenantId);
    const proctor = await encryption.encrypt("proctor-a", tenantA.tenantId);
    const store: MoodleCredentialStore = {
      findByTenantId: vi.fn().mockResolvedValue({
        tenantId: tenantA.tenantId,
        moodleUrl: "https://moodle-a.example.edu",
        encryptedAdminToken: admin,
        encryptedProctorToken: proctor,
        timeoutBudgetMs: 8_000,
        sslVerify: true,
      }),
    };
    const provider = new EncryptedMoodleCredentialProvider(store, encryption);

    await expect(
      provider.getCredentials(tenantA, "admin"),
    ).resolves.toMatchObject({
      token: "admin-a",
      baseUrl: "https://moodle-a.example.edu",
    });
    await expect(
      provider.getCredentials(tenantA, "proctor"),
    ).resolves.toMatchObject({
      token: "proctor-a",
    });
  });

  it("rejects a record or ciphertext belonging to another tenant", async () => {
    const encryptedForA = await encryption.encrypt("admin-a", tenantA.tenantId);
    const store: MoodleCredentialStore = {
      findByTenantId: vi.fn().mockResolvedValue({
        tenantId: tenantA.tenantId,
        moodleUrl: "https://moodle-a.example.edu",
        encryptedAdminToken: encryptedForA,
        encryptedProctorToken: null,
        timeoutBudgetMs: 5_000,
        sslVerify: true,
      }),
    };
    const provider = new EncryptedMoodleCredentialProvider(store, encryption);

    await expect(provider.getCredentials(tenantB, "admin")).rejects.toThrow(
      /tenant/i,
    );
  });
});
