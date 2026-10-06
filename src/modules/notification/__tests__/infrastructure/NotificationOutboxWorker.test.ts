// Files: src/modules/notification/__tests__/infrastructure/NotificationOutboxWorker.test.ts

import { describe, expect, it, vi, beforeEach } from "vitest";
import { NotificationOutboxWorker } from "@/modules/notification/infrastructure/workers/NotificationOutboxWorker";
import type { OutboxWorkerDependencies } from "@/modules/notification/infrastructure/workers/NotificationOutboxWorker";
import type {
  NotificationOutboxRepositoryInterface,
  OutboxJobRecord,
} from "@/modules/notification/domain/interfaces/NotificationOutboxRepositoryInterface";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import type { PushNotificationAdapterInterface } from "@/modules/notification/domain/interfaces/PushNotificationAdapterInterface";
import type { NotificationDispatchService } from "@/modules/notification/application/services/NotificationDispatchService";
import { NotificationEntity } from "@/modules/notification/domain/entity/NotificationEntity";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
  NotificationType,
} from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";

describe("NotificationOutboxWorker", () => {
  let mockOutboxRepo: {
    claimDueJobs: ReturnType<typeof vi.fn>;
    completeJob: ReturnType<typeof vi.fn>;
    failJob: ReturnType<typeof vi.fn>;
    enqueue: ReturnType<typeof vi.fn>;
  };
  let mockCampaignRepo: {
    findById: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
  };
  let mockNotificationRepo: {
    findById: ReturnType<typeof vi.fn>;
  };
  let mockDispatchService: {
    dispatchCampaign: ReturnType<typeof vi.fn>;
  };
  let mockPushAdapter: {
    dispatchNotification: ReturnType<typeof vi.fn>;
  };
  let deps: OutboxWorkerDependencies;
  let worker: NotificationOutboxWorker;

  beforeEach(() => {
    mockOutboxRepo = {
      claimDueJobs: vi.fn(),
      completeJob: vi.fn(),
      failJob: vi.fn(),
      enqueue: vi.fn(),
    };
    mockCampaignRepo = {
      findById: vi.fn(),
      save: vi.fn(),
    };
    mockNotificationRepo = {
      findById: vi.fn(),
    };
    mockDispatchService = {
      dispatchCampaign: vi.fn(),
    };
    mockPushAdapter = {
      dispatchNotification: vi.fn(),
    };

    deps = {
      outboxRepo: mockOutboxRepo as unknown as NotificationOutboxRepositoryInterface,
      campaignRepo: mockCampaignRepo as unknown as NotificationCampaignRepositoryInterface,
      notificationRepo: mockNotificationRepo as unknown as NotificationRepositoryInterface,
      dispatchService: mockDispatchService as unknown as NotificationDispatchService,
      pushAdapter: mockPushAdapter as unknown as PushNotificationAdapterInterface,
    };

    worker = new NotificationOutboxWorker(deps, "test-worker-1");
  });

  it("should process and complete DISPATCH_CAMPAIGN jobs", async () => {
    const job: OutboxJobRecord = {
      id: "job-1",
      campaignId: "camp-1",
      jobType: "DISPATCH_CAMPAIGN",
      payload: null,
      attempts: 0,
    };

    const campaign = new NotificationCampaignEntity({
      id: "camp-1",
      ownerScope: NotificationOwnerScope.TENANT,
      ownerTenantId: "tenant-1",
      createdById: "user-1",
      createdByRole: "TENANT",
      title: "Test Campaign",
      contentJson: { type: "doc" },
      sanitizedHtml: "<p>Test Body</p>",
      plainText: "Test Body",
      audienceSpec: {
        scope: NotificationAudienceScope.ALL,
      },
      channels: [NotificationChannel.IN_APP],
      dispatchStatus: NotificationDispatchStatus.QUEUED,
    });

    mockOutboxRepo.claimDueJobs.mockResolvedValue([job]);
    mockCampaignRepo.findById.mockResolvedValue(campaign);

    const result = await worker.processNextBatch();

    expect(result).toEqual({ processed: 1, succeeded: 1, failed: 0 });
    expect(mockDispatchService.dispatchCampaign).toHaveBeenCalledWith(campaign);
    expect(mockOutboxRepo.completeJob).toHaveBeenCalledWith("job-1");
  });

  it("should process and complete RETRY_PUSH_DISPATCH jobs", async () => {
    const job: OutboxJobRecord = {
      id: "job-2",
      campaignId: "notif-1",
      jobType: "RETRY_PUSH_DISPATCH",
      payload: { notificationId: "notif-1" },
      attempts: 1,
    };

    const notification = new NotificationEntity({
      id: "notif-1",
      tenantId: "t-1",
      recipientId: "u-1",
      recipientRole: "STUDENT",
      type: NotificationType.ANNOUNCEMENT,
      title: "Title",
      body: "Body",
      linkPath: null,
      isRead: false,
      readAt: null,
      createdAt: new Date(),
    });

    mockOutboxRepo.claimDueJobs.mockResolvedValue([job]);
    mockNotificationRepo.findById.mockResolvedValue(notification);
    mockPushAdapter.dispatchNotification.mockResolvedValue({
      outcome: "ACCEPTED",
      messageId: "msg-123",
      isRetryable: false,
    });

    const result = await worker.processNextBatch();

    expect(result).toEqual({ processed: 1, succeeded: 1, failed: 0 });
    expect(mockPushAdapter.dispatchNotification).toHaveBeenCalledWith(notification);
    expect(mockOutboxRepo.completeJob).toHaveBeenCalledWith("job-2");
  });

  it("should fail job and apply backoff when dispatch throws", async () => {
    const job: OutboxJobRecord = {
      id: "job-3",
      campaignId: "camp-unknown",
      jobType: "DISPATCH_CAMPAIGN",
      payload: null,
      attempts: 2,
    };

    mockOutboxRepo.claimDueJobs.mockResolvedValue([job]);
    mockCampaignRepo.findById.mockResolvedValue(null);

    const result = await worker.processNextBatch();

    expect(result).toEqual({ processed: 1, succeeded: 0, failed: 1 });
    expect(mockOutboxRepo.failJob).toHaveBeenCalledWith(
      "job-3",
      true, // attempts + 1 = 3 < 5
      expect.any(Number),
    );
  });

  it("should fail job with canRetry=false after reaching max attempts", async () => {
    const job: OutboxJobRecord = {
      id: "job-4",
      campaignId: "camp-unknown",
      jobType: "DISPATCH_CAMPAIGN",
      payload: null,
      attempts: 4, // Next attempt is 5, which reaches limit
    };

    mockOutboxRepo.claimDueJobs.mockResolvedValue([job]);
    mockCampaignRepo.findById.mockResolvedValue(null);

    const result = await worker.processNextBatch();

    expect(result).toEqual({ processed: 1, succeeded: 0, failed: 1 });
    expect(mockOutboxRepo.failJob).toHaveBeenCalledWith("job-4", false, expect.any(Number));
  });

  it("should stop and clear timer on stop()", () => {
    worker.start(1000);
    worker.stop();
    expect(() => worker.stop()).not.toThrow();
  });
});
