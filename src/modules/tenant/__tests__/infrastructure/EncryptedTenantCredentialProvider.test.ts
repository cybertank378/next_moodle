import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantContext } from "@/core/tenant/TenantContext";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import { AesGcmEncryptionProvider } from "@/modules/tenant/infrastructure/providers/AesGcmEncryptionProvider";
import { EncryptedTenantCredentialProvider } from "@/modules/tenant/infrastructure/providers/EncryptedTenantCredentialProvider";
import { DatabaseTenantCredentialRepository } from "@/modules/tenant/infrastructure/repositories/DatabaseTenantCredentialRepository";
import { DatabaseTenantRepository } from "@/modules/tenant/infrastructure/repositories/DatabaseTenantRepository";

describe("EncryptedTenantCredentialProvider Multi-Tenant Isolation", () => {
  const encryptionProvider = new AesGcmEncryptionProvider(
    "test-encryption-key-for-unit-tests-12345",
  );
  const tenantRepo = new DatabaseTenantRepository();
  const credRepo = new DatabaseTenantCredentialRepository(encryptionProvider);
  const provider = new EncryptedTenantCredentialProvider(
    tenantRepo,
    credRepo,
    encryptionProvider,
  );

  it("should isolate credentials between Tenant A and Tenant B", async () => {
    // Setup Tenant A
    const tenantA = new Tenant({
      id: "tenant-a",
      slug: "tenant-a",
      name: "Tenant A",
      status: "ACTIVE",
      moodleBaseUrl: "https://moodle-a.example.test",
    });
    await tenantRepo.create(tenantA);
    const encTokenA = encryptionProvider.encrypt("token_secret_A");
    await credRepo.save({
      tenantId: "tenant-a",
      encryptedToken: encTokenA.encryptedValue,
      iv: encTokenA.iv,
      authTag: encTokenA.authTag,
      keyVersion: encTokenA.keyVersion,
    });

    // Setup Tenant B
    const tenantB = new Tenant({
      id: "tenant-b",
      slug: "tenant-b",
      name: "Tenant B",
      status: "ACTIVE",
      moodleBaseUrl: "https://moodle-b.example.test",
    });
    await tenantRepo.create(tenantB);
    const encTokenB = encryptionProvider.encrypt("token_secret_B");
    await credRepo.save({
      tenantId: "tenant-b",
      encryptedToken: encTokenB.encryptedValue,
      iv: encTokenB.iv,
      authTag: encTokenB.authTag,
      keyVersion: encTokenB.keyVersion,
    });

    // Resolve context A
    const contextA: TenantContext = {
      tenantId: "tenant-a",
      slug: "tenant-a",
      name: "Tenant A",
      status: "ACTIVE",
    };
    const credA = await provider.getCredential(contextA);
    expect(credA.baseUrl).toBe("https://moodle-a.example.test");
    expect(credA.token).toBe("token_secret_A");

    // Resolve context B
    const contextB: TenantContext = {
      tenantId: "tenant-b",
      slug: "tenant-b",
      name: "Tenant B",
      status: "ACTIVE",
    };
    const credB = await provider.getCredential(contextB);
    expect(credB.baseUrl).toBe("https://moodle-b.example.test");
    expect(credB.token).toBe("token_secret_B");

    // Ensure no cross-binding
    expect(credA.token).not.toBe(credB.token);
  });

  it("should throw NotFoundError if tenant does not exist in repository", async () => {
    const unknownContext: TenantContext = {
      tenantId: "unknown-tenant",
      slug: "unknown",
      name: "Unknown",
      status: "ACTIVE",
    };
    await expect(provider.getCredential(unknownContext)).rejects.toThrow(
      NotFoundError,
    );
  });

  it("should block credential retrieval for INACTIVE or SUSPENDED tenant", async () => {
    const inactiveTenant = new Tenant({
      id: "tenant-inactive",
      slug: "tenant-inactive",
      name: "Tenant Inactive",
      status: "INACTIVE",
      moodleBaseUrl: "https://moodle.inactive.test",
    });
    await tenantRepo.create(inactiveTenant);

    const context: TenantContext = {
      tenantId: "tenant-inactive",
      slug: "tenant-inactive",
      name: "Tenant Inactive",
      status: "INACTIVE",
    };
    await expect(provider.getCredential(context)).rejects.toThrow(
      ForbiddenError,
    );
  });

  it("should throw InfrastructureError if credential is not configured for tenant", async () => {
    const noCredTenant = new Tenant({
      id: "tenant-nocred",
      slug: "tenant-nocred",
      name: "Tenant No Cred",
      status: "ACTIVE",
      moodleBaseUrl: "https://moodle.nocred.test",
    });
    await tenantRepo.create(noCredTenant);

    const context: TenantContext = {
      tenantId: "tenant-nocred",
      slug: "tenant-nocred",
      name: "Tenant No Cred",
      status: "ACTIVE",
    };
    await expect(provider.getCredential(context)).rejects.toThrow(
      InfrastructureError,
    );
  });
});
