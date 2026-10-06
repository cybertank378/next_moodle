// Files: src/modules/notification/infrastructure/repo/PrismaNotificationOutboxRepository.ts

import type { Prisma } from "@prisma/client";
import { prisma } from "@/libs/prisma";
import type {
  NotificationOutboxRepositoryInterface,
  OutboxJobRecord,
} from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";

export class PrismaNotificationOutboxRepository
  implements NotificationOutboxRepositoryInterface
{
  async enqueue(
    campaignId: string,
    jobType: string,
    payload?: Record<string, unknown>,
    availableAt?: Date,
  ): Promise<void> {
    await prisma.notificationOutbox.create({
      data: {
        id: crypto.randomUUID(),
        campaignId,
        jobType,
        payload: (payload as unknown as Prisma.InputJsonValue) ?? undefined,
        availableAt: availableAt ?? new Date(),
        status: "PENDING",
      },
    });
  }

  async claimDueJobs(
    limit: number,
    leaseOwner: string,
    leaseDurationMs: number,
  ): Promise<OutboxJobRecord[]> {
    const now = new Date();
    const leaseExpiresAt = new Date(now.getTime() + leaseDurationMs);

    // Find pending jobs or jobs whose lease expired
    const candidateJobs = await prisma.notificationOutbox.findMany({
      where: {
        availableAt: { lte: now },
        OR: [
          { status: "PENDING" },
          {
            status: "PROCESSING",
            leaseExpiresAt: { lte: now },
          },
        ],
      },
      take: limit,
      orderBy: { availableAt: "asc" },
    });

    const claimed: OutboxJobRecord[] = [];

    for (const job of candidateJobs) {
      try {
        const updated = await prisma.notificationOutbox.update({
          where: { id: job.id },
          data: {
            status: "PROCESSING",
            leaseOwner,
            leaseExpiresAt,
            attempts: { increment: 1 },
          },
        });
        claimed.push({
          id: updated.id,
          campaignId: updated.campaignId,
          jobType: updated.jobType,
          payload: updated.payload as Record<string, unknown> | null,
          attempts: updated.attempts,
        });
      } catch {
        // Ignored if claimed concurrently by another worker
      }
    }

    return claimed;
  }

  async completeJob(id: string): Promise<void> {
    await prisma.notificationOutbox.update({
      where: { id },
      data: {
        status: "COMPLETED",
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }

  async failJob(
    id: string,
    canRetry: boolean,
    backoffMs = 5000,
  ): Promise<void> {
    const nextAvailable = new Date(Date.now() + backoffMs);
    await prisma.notificationOutbox.update({
      where: { id },
      data: {
        status: canRetry ? "PENDING" : "FAILED",
        availableAt: canRetry ? nextAvailable : undefined,
        leaseOwner: null,
        leaseExpiresAt: null,
      },
    });
  }
}
