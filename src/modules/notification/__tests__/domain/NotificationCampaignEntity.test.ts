// Files: src/modules/notification/__tests__/domain/NotificationCampaignEntity.test.ts

import { describe, expect, it } from "vitest";
import { ValidationError } from "@/core/errors/ValidationError";
import { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import {
  NotificationAudienceScope,
  NotificationChannel,
  NotificationDispatchStatus,
  NotificationOwnerScope,
} from "@/modules/notification/domain/types/NotificationTypes";

describe("NotificationCampaignEntity", () => {
  const createSampleCampaign = (
    status: NotificationDispatchStatus = NotificationDispatchStatus.DRAFT,
  ) => {
    return new NotificationCampaignEntity({
      id: "camp-123",
      ownerScope: NotificationOwnerScope.TENANT,
      ownerTenantId: "tenant-abc",
      createdById: "user-1",
      createdByRole: "TENANT",
      title: "Pengumuman Ujian Semester",
      contentJson: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [{ type: "text", text: "Jadwal ujian." }],
          },
        ],
      },
      contentSchemaVersion: 1,
      sanitizedHtml: "<p>Jadwal ujian.</p>",
      plainText: "Jadwal ujian.",
      pushSummary: "Jadwal ujian semester sudah keluar.",
      audienceSpec: { scope: NotificationAudienceScope.ALL },
      channels: [NotificationChannel.IN_APP, NotificationChannel.PUSH],
      dispatchStatus: status,
      scheduledAt: null,
      timezone: "Asia/Jakarta",
      archivedAt: null,
      version: 1,
      createdAt: new Date("2026-10-05T00:00:00Z"),
      updatedAt: new Date("2026-10-05T00:00:00Z"),
    });
  };

  it("creates a campaign with valid draft status", () => {
    const campaign = createSampleCampaign();
    expect(campaign.id).toBe("camp-123");
    expect(campaign.dispatchStatus).toBe(NotificationDispatchStatus.DRAFT);
    expect(campaign.canEdit).toBe(true);
    expect(campaign.canDelete).toBe(true);
    expect(campaign.canSchedule).toBe(true);
    expect(campaign.canSend).toBe(true);
  });

  it("allows transition from DRAFT to SCHEDULED with future date", () => {
    const campaign = createSampleCampaign();
    const futureDate = new Date(Date.now() + 3600 * 1000);
    campaign.schedule(futureDate, "Asia/Jakarta");

    expect(campaign.dispatchStatus).toBe(NotificationDispatchStatus.SCHEDULED);
    expect(campaign.scheduledAt).toEqual(futureDate);
    expect(campaign.canEdit).toBe(false);
  });

  it("throws ValidationError when scheduling in the past", () => {
    const campaign = createSampleCampaign();
    const pastDate = new Date(Date.now() - 3600 * 1000);
    expect(() => campaign.schedule(pastDate, "Asia/Jakarta")).toThrow(
      ValidationError,
    );
  });

  it("allows cancelling a SCHEDULED campaign, returning it to CANCELLED or DRAFT", () => {
    const campaign = createSampleCampaign();
    campaign.schedule(new Date(Date.now() + 3600 * 1000), "Asia/Jakarta");

    campaign.unschedule();
    expect(campaign.dispatchStatus).toBe(NotificationDispatchStatus.DRAFT);
    expect(campaign.scheduledAt).toBeNull();
  });

  it("allows queuing a campaign for dispatch", () => {
    const campaign = createSampleCampaign();
    campaign.queue();
    expect(campaign.dispatchStatus).toBe(NotificationDispatchStatus.QUEUED);
  });

  it("rejects editing when not in DRAFT status", () => {
    const campaign = createSampleCampaign(NotificationDispatchStatus.QUEUED);
    expect(() => {
      campaign.updateContent({
        title: "Judul Baru",
        contentJson: { type: "doc" },
        sanitizedHtml: "<p>Baru</p>",
        plainText: "Baru",
      });
    }).toThrow(ValidationError);
  });

  it("allows toggling archive status", () => {
    const campaign = createSampleCampaign();
    expect(campaign.isArchived).toBe(false);
    campaign.toggleArchive();
    expect(campaign.isArchived).toBe(true);
    expect(campaign.archivedAt).not.toBeNull();
    campaign.toggleArchive();
    expect(campaign.isArchived).toBe(false);
    expect(campaign.archivedAt).toBeNull();
  });

  it("validates title is not empty", () => {
    expect(() => {
      new NotificationCampaignEntity({
        id: "camp-123",
        ownerScope: NotificationOwnerScope.TENANT,
        ownerTenantId: "tenant-abc",
        createdById: "user-1",
        createdByRole: "TENANT",
        title: "   ",
        contentJson: { type: "doc" },
        contentSchemaVersion: 1,
        sanitizedHtml: "",
        plainText: "",
        pushSummary: null,
        audienceSpec: { scope: NotificationAudienceScope.ALL },
        channels: [NotificationChannel.IN_APP],
        dispatchStatus: NotificationDispatchStatus.DRAFT,
        scheduledAt: null,
        timezone: null,
        archivedAt: null,
        version: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }).toThrow(ValidationError);
  });
});
