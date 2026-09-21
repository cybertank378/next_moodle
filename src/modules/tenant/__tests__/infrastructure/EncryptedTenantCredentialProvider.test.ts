import { describe, expect, it, vi } from "vitest";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { Tenant } from "@/modules/tenant/domain/Tenant";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";
import { EncryptedTenantCredentialProvider } from "@/modules/tenant/infrastructure/EncryptedTenantCredentialProvider";

describe("EncryptedTenantCredentialProvider", () => {
  const masterKey =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const crypto = new AesHkdfEncryptionProvider(masterKey);
  const tenantId = "tenant-uuid-101";

  const createMockRepo = () => {
    return {
      findById: vi.fn(),
      findBySlug: vi.fn(),
      findByCustomDomain: vi.fn(),
      save: vi.fn(),
      delete: vi.fn(),
    } as unknown as TenantRepository;
  };

  it("should successfully retrieve and decrypt Moodle credentials for tenant", async () => {
    const rawAdminToken = "super-secret-moodle-admin-token";
    const rawProctorToken = "proctor-access-token-999";

    const encryptedAdmin = await crypto.encrypt(rawAdminToken, tenantId);
    const encryptedProctor = await crypto.encrypt(rawProctorToken, tenantId);

    const tenant = new Tenant({
      id: tenantId,
      slug: "beta-school",
      name: "Beta School",
      status: "ACTIVE",
      credential: {
        id: "cred-1",
        tenantId,
        moodleUrl: "https://moodle.betaschool.edu",
        encryptedAdminToken: encryptedAdmin,
        encryptedProctorToken: encryptedProctor,
        timeoutBudgetMs: 8000,
        sslVerify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repo = createMockRepo();
    (repo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(tenant);

    const provider = new EncryptedTenantCredentialProvider(repo, crypto);
    const credentials = await provider.getCredentials(tenantId);

    expect(credentials.moodleUrl).toBe("https://moodle.betaschool.edu");
    expect(credentials.token).toBe(rawAdminToken);
    expect(credentials.proctorToken).toBe(rawProctorToken);
    expect(credentials.timeoutMs).toBe(8000);
    expect(credentials.sslVerify).toBe(true);
  });

  it("should throw NotFoundError if tenant or credentials do not exist", async () => {
    const repo = createMockRepo();
    (repo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(null);

    const provider = new EncryptedTenantCredentialProvider(repo, crypto);
    await expect(provider.getCredentials("unknown-tenant")).rejects.toThrow(
      /not found/i,
    );
  });

  it("should reject credentials if moodleUrl targets SSRF restricted address", async () => {
    const rawAdminToken = "test-token";
    const encryptedAdmin = await crypto.encrypt(rawAdminToken, tenantId);

    const maliciousTenant = new Tenant({
      id: tenantId,
      slug: "evil-tenant",
      name: "Evil",
      status: "ACTIVE",
      credential: {
        id: "cred-evil",
        tenantId,
        moodleUrl: "http://169.254.169.254/latest/meta-data/",
        encryptedAdminToken: encryptedAdmin,
        timeoutBudgetMs: 5000,
        sslVerify: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repo = createMockRepo();
    (repo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(
      maliciousTenant,
    );

    const provider = new EncryptedTenantCredentialProvider(repo, crypto);
    await expect(provider.getCredentials(tenantId)).rejects.toThrow(/SSRF/i);
  });

  it("should enforce tenant isolation: ciphertext for tenant A fails for tenant B", async () => {
    const tenantAId = "tenant-a";
    const tenantBId = "tenant-b";

    // Encrypted with tenant A's key
    const encryptedWithA = await crypto.encrypt("secret-token", tenantAId);

    // Stored in tenant B's record (e.g. cross-tenant attack or database tampering)
    const tenantB = new Tenant({
      id: tenantBId,
      slug: "tenant-b-slug",
      name: "Tenant B",
      status: "ACTIVE",
      credential: {
        id: "cred-b",
        tenantId: tenantBId,
        moodleUrl: "https://moodle.tenantb.edu",
        encryptedAdminToken: encryptedWithA,
        timeoutBudgetMs: 5000,
        sslVerify: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const repo = createMockRepo();
    (repo.findById as ReturnType<typeof vi.fn>).mockResolvedValue(tenantB);

    const provider = new EncryptedTenantCredentialProvider(repo, crypto);
    // When tenant B attempts to decrypt tenant A's token, HKDF key mismatch triggers auth tag failure
    await expect(provider.getCredentials(tenantBId)).rejects.toThrow(
      /authentication failed|tenant isolation/i,
    );
  });
});
