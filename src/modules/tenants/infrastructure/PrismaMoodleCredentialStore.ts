import "server-only";

import type { PrismaClient } from "@prisma/client";
import type {
  EncryptedMoodleCredentialRecord,
  MoodleCredentialStore,
} from "@/core/moodle/MoodleCredentialProvider";

export class PrismaMoodleCredentialStore implements MoodleCredentialStore {
  constructor(private readonly prisma: PrismaClient) {}

  findByTenantId(
    tenantId: string,
  ): Promise<EncryptedMoodleCredentialRecord | null> {
    return this.prisma.tenantCredential.findUnique({
      where: { tenantId },
      select: {
        tenantId: true,
        moodleUrl: true,
        encryptedAdminToken: true,
        encryptedProctorToken: true,
        timeoutBudgetMs: true,
        sslVerify: true,
      },
    });
  }
}
