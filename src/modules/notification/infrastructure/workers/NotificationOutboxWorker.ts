// Files: src/modules/notification/infrastructure/workers/NotificationOutboxWorker.ts

import type { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type {
  NotificationOutboxRepositoryInterface,
  OutboxJobRecord,
} from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import type { PushNotificationAdapterInterface } from "@/modules/notification/domain/interfaces/PushNotificationAdapterInterface";

export interface OutboxWorkerDependencies {
  outboxRepo: NotificationOutboxRepositoryInterface;
  campaignRepo: NotificationCampaignRepositoryInterface;
  notificationRepo: NotificationRepositoryInterface;
  dispatchService: NotificationDispatchService;
  pushAdapter: PushNotificationAdapterInterface;
}

export class NotificationOutboxWorker {
  private readonly workerId: string;
  private isRunning = false;
  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(
    private readonly deps: OutboxWorkerDependencies,
    workerId?: string,
  ) {
    this.workerId = workerId || `worker-${crypto.randomUUID()}`;
  }

  async processNextBatch(
    limit = 10,
    leaseDurationMs = 60_000,
  ): Promise<{ processed: number; succeeded: number; failed: number }> {
    const jobs = await this.deps.outboxRepo.claimDueJobs(
      limit,
      this.workerId,
      leaseDurationMs,
    );
    let succeeded = 0;
    let failed = 0;

    for (const job of jobs) {
      try {
        await this.processJob(job);
        await this.deps.outboxRepo.completeJob(job.id);
        succeeded += 1;
      } catch (error: unknown) {
        failed += 1;
        const attempts = job.attempts;
        const canRetry = attempts < 5;
        // Exponential backoff with jitter: 2^attempts * 1000ms + random(500)
        const baseBackoff = Math.min(60_000, 2 ** attempts * 1000);
        const jitter = Math.floor(Math.random() * 500);
        const backoffMs = baseBackoff + jitter;

        console.error("[OutboxWorker] Dispatch failed", {
          jobId: job.id,
          campaignId: job.campaignId,
          jobType: job.jobType,
          attempts: job.attempts,
          error,
        });
        await this.deps.outboxRepo.failJob(job.id, canRetry, backoffMs);
      }
    }

    return { processed: jobs.length, succeeded, failed };
  }

  private async processJob(job: OutboxJobRecord): Promise<void> {
    switch (job.jobType) {
      case "DISPATCH_CAMPAIGN": {
        const campaign = await this.deps.campaignRepo.findById(job.campaignId);
        if (!campaign) {
          throw new Error(`Campaign ${job.campaignId} not found`);
        }
        await this.deps.dispatchService.dispatchCampaign(campaign);
        break;
      }

      case "RETRY_PUSH_DISPATCH": {
        const notificationId =
          (job.payload?.notificationId as string) || job.campaignId;
        const notification =
          await this.deps.notificationRepo.findById(notificationId);
        if (!notification) {
          throw new Error(`Notification ${notificationId} not found`);
        }
        const result =
          await this.deps.pushAdapter.dispatchNotification(notification);
        if (result && result.outcome === "FAILED") {
          throw new Error(
            `Push dispatch retry failed: ${result.errorCode || "UNKNOWN"}`,
          );
        }
        break;
      }

      default:
        console.warn(`[OutboxWorker] Unknown job type: ${job.jobType}`);
    }
  }

  start(intervalMs = 15_000): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.timer = setInterval(() => {
      void this.processNextBatch();
    }, intervalMs);
  }

  stop(): void {
    this.isRunning = false;
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
