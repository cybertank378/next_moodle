// Files: src/modules/notification/__tests__/application/NotificationCampaignUseCases.test.ts

import { beforeEach, describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { AppRole } from "@/core/rbac/AppRole";
import { ArchiveNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ArchiveNotificationCampaignUseCase";
import { CancelNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CancelNotificationCampaignUseCase";
import { CreateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/CreateNotificationCampaignUseCase";
import { DeleteNotificationDraftUseCase } from "@/modules/notification/application/usecases/DeleteNotificationDraftUseCase";
import { PreviewNotificationAudienceUseCase } from "@/modules/notification/application/usecases/PreviewNotificationAudienceUseCase";
import { ScheduleNotificationCampaignUseCase } from "@/modules/notification/application/usecases/ScheduleNotificationCampaignUseCase";
import { SendNotificationCampaignUseCase } from "@/modules/notification/application/usecases/SendNotificationCampaignUseCase";
import { UpdateNotificationCampaignUseCase } from "@/modules/notification/application/usecases/UpdateNotificationCampaignUseCase";
import { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationContentRendererInterface } from "@/modules/notification/domain/interfaces/NotificationContentRendererInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationRecipientProviderInterface } from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

describe("Notification Campaign Application Use Cases", () => {
  let mockCampaignRepo: NotificationCampaignRepositoryInterface;
  let mockDeliveryRepo: NotificationDeliveryRepositoryInterface;
  let mockRecipientProvider: NotificationRecipientProviderInterface;
  let mockRenderer: NotificationContentRendererInterface;

  const mockAdminActor = {
    id: "admin-1",
    role: AppRole.ADMIN,
    tenantId: null,
  };

  const mockTenantActor = {
    id: "tenant-user-1",
    role: AppRole.TENANT,
    tenantId: "tenant-abc",
  };

  beforeEach(() => {
    mockCampaignRepo = {
      create: vi.fn(async (c) => c),
      findById: vi.fn(),
      update: vi.fn(async (c) => c),
      deleteDraft: vi.fn(),
      findMany: vi.fn(async () => ({ campaigns: [], total: 0 })),
    };

    mockDeliveryRepo = {
      createMany: vi.fn(),
      findByCampaignId: vi.fn(async () => ({ deliveries: [], total: 0 })),
      updateStatus: vi.fn(),
      getDeliverySummary: vi.fn(async () => ({
        total: 10,
        inboxCreated: 10,
        pushAccepted: 8,
        pushFailed: 1,
        pushSkipped: 1,
        pending: 0,
      })),
      findEligibleForRetry: vi.fn(async () => []),
    };

    mockRecipientProvider = {
      resolveRecipients: vi.fn(async () => [
        {
          recipientId: "u-1",
          role: "STUDENT",
          tenantId: "tenant-abc",
          name: "Budi",
        },
      ]),
      getAudienceCount: vi.fn(async () => 1),
      getRecipientOptions: vi.fn(async () => ({ roles: [] })),
    };

    mockRenderer = {
      renderToSanitizedHtml: vi.fn(() => "<p>Halo Dunia</p>"),
      extractPlainText: vi.fn(() => "Halo Dunia"),
    };
  });

  describe("CreateNotificationCampaignUseCase", () => {
    it("allows TENANT actor to create a campaign scoped to their tenant", async () => {
      const useCase = new CreateNotificationCampaignUseCase(
        mockCampaignRepo,
        mockRenderer,
      );

      const result = await useCase.execute(
        {
          title: "Pengumuman Sekolah",
          contentJson: { type: "doc" },
          audienceSpec: { scope: NotificationAudienceScope.ALL },
          channels: [NotificationChannel.IN_APP],
        },
        mockTenantActor,
      );

      expect(result.ownerScope).toBe(NotificationOwnerScope.TENANT);
      expect(result.ownerTenantId).toBe("tenant-abc");
      expect(mockCampaignRepo.create).toHaveBeenCalled();
    });

    it("allows ADMIN actor to create a PLATFORM campaign", async () => {
      const useCase = new CreateNotificationCampaignUseCase(
        mockCampaignRepo,
        mockRenderer,
      );

      const result = await useCase.execute(
        {
          title: "Pengumuman Platform",
          contentJson: { type: "doc" },
          audienceSpec: { scope: NotificationAudienceScope.ALL },
          channels: [NotificationChannel.IN_APP],
        },
        mockAdminActor,
      );

      expect(result.ownerScope).toBe(NotificationOwnerScope.PLATFORM);
      expect(result.ownerTenantId).toBeNull();
    });

    it("throws ForbiddenError if STUDENT tries to create campaign", async () => {
      const useCase = new CreateNotificationCampaignUseCase(
        mockCampaignRepo,
        mockRenderer,
      );

      await expect(
        useCase.execute(
          {
            title: "Pengumuman",
            contentJson: { type: "doc" },
            audienceSpec: { scope: NotificationAudienceScope.ALL },
            channels: [NotificationChannel.IN_APP],
          },
          { id: "student-1", role: AppRole.STUDENT, tenantId: "tenant-abc" },
        ),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("UpdateNotificationCampaignUseCase", () => {
    it("prevents TENANT from updating campaign belonging to another tenant", async () => {
      const existing = new NotificationCampaignEntity({
        id: "camp-xyz",
        ownerScope: NotificationOwnerScope.TENANT,
        ownerTenantId: "tenant-other",
        createdById: "other-user",
        createdByRole: "TENANT",
        title: "Other Title",
        contentJson: { type: "doc" },
        sanitizedHtml: "",
        plainText: "",
        audienceSpec: { scope: NotificationAudienceScope.ALL },
        channels: [NotificationChannel.IN_APP],
        dispatchStatus: NotificationDispatchStatus.DRAFT,
      });

      vi.mocked(mockCampaignRepo.findById).mockResolvedValue(existing);

      const useCase = new UpdateNotificationCampaignUseCase(
        mockCampaignRepo,
        mockRenderer,
      );

      await expect(
        useCase.execute(
          "camp-xyz",
          { title: "New Title", contentJson: { type: "doc" } },
          mockTenantActor,
        ),
      ).rejects.toThrow(ForbiddenError);
    });
  });

  describe("CancelNotificationCampaignUseCase", () => {
    it("cancels a SCHEDULED campaign", async () => {
      const existing = new NotificationCampaignEntity({
        id: "camp-1",
        ownerScope: NotificationOwnerScope.TENANT,
        ownerTenantId: "tenant-abc",
        createdById: "tenant-user-1",
        createdByRole: "TENANT",
        title: "Scheduled Camp",
        contentJson: { type: "doc" },
        sanitizedHtml: "",
        plainText: "",
        audienceSpec: { scope: NotificationAudienceScope.ALL },
        channels: [NotificationChannel.IN_APP],
        dispatchStatus: NotificationDispatchStatus.SCHEDULED,
      });

      vi.mocked(mockCampaignRepo.findById).mockResolvedValue(existing);

      const useCase = new CancelNotificationCampaignUseCase(mockCampaignRepo);
      const updated = await useCase.execute("camp-1", mockTenantActor);

      expect(updated.dispatchStatus).toBe(NotificationDispatchStatus.CANCELLED);
      expect(mockCampaignRepo.update).toHaveBeenCalled();
    });
  });

  describe("PreviewNotificationAudienceUseCase", () => {
    it("returns estimated recipient count and sample recipients", async () => {
      const useCase = new PreviewNotificationAudienceUseCase(
        mockRecipientProvider,
      );

      const result = await useCase.execute(
        { audienceSpec: { scope: NotificationAudienceScope.ALL } },
        mockTenantActor,
      );

      expect(result.estimatedCount).toBe(1);
      expect(result.sampleRecipients).toHaveLength(1);
      expect(result.sampleRecipients?.[0].name).toBe("Budi");
    });
  });
});
