-- Guarantee campaign-channel delivery idempotency on worker restarts.
DELETE FROM "notification_deliveries" newer
USING "notification_deliveries" older
WHERE newer."campaignId"=older."campaignId"
  AND newer."recipientId"=older."recipientId"
  AND newer."recipientRole"=older."recipientRole"
  AND newer."channel"=older."channel"
  AND (newer."createdAt", newer."id") > (older."createdAt", older."id");
CREATE UNIQUE INDEX "notification_deliveries_campaignId_recipientId_recipientRole_channel_key"
ON "notification_deliveries"("campaignId","recipientId","recipientRole","channel");
