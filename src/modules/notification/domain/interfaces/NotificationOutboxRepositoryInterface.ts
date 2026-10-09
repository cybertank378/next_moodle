// Files: src/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface.ts

export interface OutboxJobRecord {
  id: string;
  campaignId: string;
  jobType: string;
  payload: Record<string, unknown> | null;
  attempts: number;
}

export interface NotificationOutboxRepositoryInterface {
  enqueue(
    campaignId: string,
    jobType: string,
    payload?: Record<string, unknown>,
    availableAt?: Date,
  ): Promise<void>;
  claimDueJobs(
    limit: number,
    leaseOwner: string,
    leaseDurationMs: number,
  ): Promise<OutboxJobRecord[]>;
  completeJob(id: string): Promise<void>;
  failJob(id: string, canRetry: boolean, backoffMs?: number): Promise<void>;
}
