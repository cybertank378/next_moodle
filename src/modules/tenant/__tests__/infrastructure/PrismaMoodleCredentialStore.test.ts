import type { PrismaClient } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";
import { PrismaMoodleCredentialStore } from "@/modules/tenant/infrastructure/repo/PrismaMoodleCredentialStore";

describe("PrismaMoodleCredentialStore", () => {
  it("loads encrypted credentials by the trusted tenant id", async () => {
    const findUnique = vi.fn().mockResolvedValue({
      tenantId: "tenant-a",
      moodleUrl: "https://moodle-a.example.edu",
      encryptedAdminToken: "encrypted-admin",
      encryptedProctorToken: "encrypted-proctor",
      timeoutBudgetMs: 8_000,
      sslVerify: true,
    });
    const prisma = {
      tenantCredential: { findUnique },
    } as unknown as PrismaClient;

    const result = await new PrismaMoodleCredentialStore(prisma).findByTenantId(
      "tenant-a",
    );

    expect(findUnique).toHaveBeenCalledWith({
      where: { tenantId: "tenant-a" },
      select: {
        tenantId: true,
        moodleUrl: true,
        encryptedAdminToken: true,
        encryptedProctorToken: true,
        timeoutBudgetMs: true,
        sslVerify: true,
      },
    });
    expect(result?.encryptedAdminToken).toBe("encrypted-admin");
  });
});
