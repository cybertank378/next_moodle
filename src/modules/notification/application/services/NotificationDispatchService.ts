// Files: src/modules/notification/application/services/NotificationDispatchService.ts

import type { NotificationCampaignEntity } from "@/modules/notification/domain/entity/NotificationCampaignEntity";
import { NotificationDeliveryEntity } from "@/modules/notification/domain/entity/NotificationDeliveryEntity";
import type { NotificationCampaignRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationCampaignRepositoryInterface";
import type { NotificationDeliveryRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeliveryRepositoryInterface";
import type { NotificationDeviceRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";
import type { NotificationRecipientProviderInterface } from "@/modules/notification/domain/interfaces/NotificationRecipientProviderInterface";
import type { NotificationRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationRepositoryInterface";
import type { PushNotificationAdapterInterface } from "@/modules/notification/domain/interfaces/PushNotificationAdapterInterface";
import {
  NotificationChannel,
  NotificationDeliveryStatus,
  NotificationType,
} from "@/modules/notification/domain/types/NotificationTypes";
import { NotificationScope } from "@/modules/notification/domain/value-object/NotificationScope";

export class NotificationDispatchService {
  constructor(
    private readonly campaignRepo: NotificationCampaignRepositoryInterface,
    private readonly deliveryRepo: NotificationDeliveryRepositoryInterface,
    private readonly recipientProvider: NotificationRecipientProviderInterface,
    private readonly inboxRepo: NotificationRepositoryInterface,
    private readonly deviceRepo: NotificationDeviceRepositoryInterface,
    private readonly pushAdapter: PushNotificationAdapterInterface,
  ) {}

  async dispatchCampaign(campaign: NotificationCampaignEntity): Promise<void> {
    campaign.markProcessing();
    await this.campaignRepo.update(campaign);

    // 1. Resolve recipients
    const recipients = await this.recipientProvider.resolveRecipients(
      campaign.audienceSpec,
      campaign.ownerScope,
      campaign.ownerTenantId,
    );

    const deliveries: NotificationDeliveryEntity[] = [];
    if (recipients.length === 0) {
      campaign.markFailed();
      await this.campaignRepo.update(campaign);
      return;
    }
    let hasFailure = false;
    let hasSuccess = false;

    // 2. Handle IN_APP channel
    if (campaign.channels.includes(NotificationChannel.IN_APP)) {
      for (const recipient of recipients) {
        const scope = NotificationScope.forRecipient({
          recipientId: recipient.recipientId,
          role: recipient.role,
          tenantId: recipient.tenantId,
        });

        await this.inboxRepo.create({
          scope,
          campaignId: campaign.id,
          type: NotificationType.ANNOUNCEMENT,
          title: campaign.title,
          body: campaign.plainText.slice(0, 1000),
          linkPath: `/announcements/${campaign.id}`,
        });

        const delivery = new NotificationDeliveryEntity({
          id: crypto.randomUUID(),
          campaignId: campaign.id,
          recipientId: recipient.recipientId,
          recipientRole: recipient.role,
          tenantId: recipient.tenantId,
          channel: NotificationChannel.IN_APP,
          status: NotificationDeliveryStatus.ACCEPTED,
          attempts: 1,
          acceptedAt: new Date(),
        });
        deliveries.push(delivery);
        hasSuccess = true;
      }
    }

    // 3. Handle PUSH channel
    if (campaign.channels.includes(NotificationChannel.PUSH)) {
      const activeDevices = await this.deviceRepo.findActiveByRecipients(
        recipients.map((r) => ({
          recipientId: r.recipientId,
          role: r.role,
          tenantId: r.tenantId,
        })),
      );

      const deviceMap = new Map<string, string>();
      for (const d of activeDevices) {
        deviceMap.set(`${d.tenantId}_${d.userId}_${d.role}`, d.token);
      }

      for (const recipient of recipients) {
        const token = deviceMap.get(
          `${recipient.tenantId}_${recipient.recipientId}_${recipient.role}`,
        );

        if (!token) {
          const skippedDelivery = new NotificationDeliveryEntity({
            id: crypto.randomUUID(),
            campaignId: campaign.id,
            recipientId: recipient.recipientId,
            recipientRole: recipient.role,
            tenantId: recipient.tenantId,
            channel: NotificationChannel.PUSH,
            status: NotificationDeliveryStatus.SKIPPED,
            errorCode: "NO_ACTIVE_DEVICE",
          });
          deliveries.push(skippedDelivery);
          continue;
        }

        try {
          if (!this.pushAdapter.sendPushNotification) {
            throw new Error("PUSH_ADAPTER_UNAVAILABLE");
          }
          await this.pushAdapter.sendPushNotification({
              token,
              title: campaign.title,
              body: campaign.pushSummary || campaign.plainText.slice(0, 200),
              data: {
                campaignId: campaign.id,
                type: "CAMPAIGN_ANNOUNCEMENT",
              },
            });

          const successDelivery = new NotificationDeliveryEntity({
            id: crypto.randomUUID(),
            campaignId: campaign.id,
            recipientId: recipient.recipientId,
            recipientRole: recipient.role,
            tenantId: recipient.tenantId,
            channel: NotificationChannel.PUSH,
            deviceToken: token,
            status: NotificationDeliveryStatus.ACCEPTED,
            attempts: 1,
            acceptedAt: new Date(),
          });
          deliveries.push(successDelivery);
          hasSuccess = true;
        } catch (err: unknown) {
          hasFailure = true;
          const errorMsg = "PUSH_SEND_FAILED";
          const failDelivery = new NotificationDeliveryEntity({
            id: crypto.randomUUID(),
            campaignId: campaign.id,
            recipientId: recipient.recipientId,
            recipientRole: recipient.role,
            tenantId: recipient.tenantId,
            channel: NotificationChannel.PUSH,
            deviceToken: token,
            status: NotificationDeliveryStatus.FAILED,
            attempts: 1,
            errorCode: errorMsg,
          });
          deliveries.push(failDelivery);
        }
      }
    }

    if (deliveries.length > 0) {
      await this.deliveryRepo.createMany(deliveries);
    }

    // 4. Update campaign status
    if (hasFailure && hasSuccess) {
      campaign.markPartialFailed();
    } else if (hasFailure && !hasSuccess) {
      campaign.markFailed();
    } else {
      campaign.markCompleted();
    }

    await this.campaignRepo.update(campaign);
  }
}
