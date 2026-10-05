-- AlterTable
ALTER TABLE "notifications" ADD COLUMN     "campaignId" TEXT;

-- CreateTable
CREATE TABLE "notification_campaigns" (
    "id" TEXT NOT NULL,
    "ownerScope" TEXT NOT NULL,
    "ownerTenantId" TEXT,
    "createdById" TEXT NOT NULL,
    "createdByRole" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentJson" JSONB NOT NULL,
    "contentSchemaVersion" INTEGER NOT NULL DEFAULT 1,
    "sanitizedHtml" TEXT NOT NULL,
    "plainText" TEXT NOT NULL,
    "pushSummary" TEXT,
    "audienceSpec" JSONB NOT NULL,
    "channels" TEXT[] DEFAULT ARRAY['IN_APP']::TEXT[],
    "dispatchStatus" TEXT NOT NULL DEFAULT 'DRAFT',
    "scheduledAt" TIMESTAMP(3),
    "timezone" TEXT,
    "archivedAt" TIMESTAMP(3),
    "version" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_campaigns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_campaign_recipients" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "tenantId" TEXT,
    "recipientId" TEXT NOT NULL,
    "recipientRole" TEXT NOT NULL,
    "resolvedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notification_campaign_recipients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_deliveries" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "recipientId" TEXT NOT NULL,
    "recipientRole" TEXT NOT NULL,
    "tenantId" TEXT,
    "channel" TEXT NOT NULL,
    "deviceToken" TEXT,
    "status" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "nextAttemptAt" TIMESTAMP(3),
    "providerMessageId" TEXT,
    "errorCode" TEXT,
    "acceptedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_deliveries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_outbox" (
    "id" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "payload" JSONB,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseOwner" TEXT,
    "leaseExpiresAt" TIMESTAMP(3),
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_outbox_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notification_devices" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "tenantId" TEXT,
    "token" TEXT NOT NULL,
    "platform" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notification_devices_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notification_campaigns_ownerScope_ownerTenantId_dispatchSta_idx" ON "notification_campaigns"("ownerScope", "ownerTenantId", "dispatchStatus");

-- CreateIndex
CREATE INDEX "notification_campaigns_dispatchStatus_scheduledAt_idx" ON "notification_campaigns"("dispatchStatus", "scheduledAt");

-- CreateIndex
CREATE INDEX "notification_campaigns_createdAt_idx" ON "notification_campaigns"("createdAt");

-- CreateIndex
CREATE INDEX "notification_campaign_recipients_campaignId_idx" ON "notification_campaign_recipients"("campaignId");

-- CreateIndex
CREATE INDEX "notification_campaign_recipients_tenantId_recipientId_idx" ON "notification_campaign_recipients"("tenantId", "recipientId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_campaign_recipients_campaignId_recipientId_rec_key" ON "notification_campaign_recipients"("campaignId", "recipientId", "recipientRole");

-- CreateIndex
CREATE INDEX "notification_deliveries_campaignId_status_idx" ON "notification_deliveries"("campaignId", "status");

-- CreateIndex
CREATE INDEX "notification_deliveries_campaignId_channel_idx" ON "notification_deliveries"("campaignId", "channel");

-- CreateIndex
CREATE INDEX "notification_deliveries_recipientId_channel_idx" ON "notification_deliveries"("recipientId", "channel");

-- CreateIndex
CREATE INDEX "notification_outbox_status_availableAt_idx" ON "notification_outbox"("status", "availableAt");

-- CreateIndex
CREATE INDEX "notification_outbox_campaignId_idx" ON "notification_outbox"("campaignId");

-- CreateIndex
CREATE UNIQUE INDEX "notification_devices_token_key" ON "notification_devices"("token");

-- CreateIndex
CREATE INDEX "notification_devices_userId_role_active_idx" ON "notification_devices"("userId", "role", "active");

-- CreateIndex
CREATE INDEX "notification_devices_tenantId_role_idx" ON "notification_devices"("tenantId", "role");

-- CreateIndex
CREATE INDEX "notifications_campaignId_idx" ON "notifications"("campaignId");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "notification_campaigns"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_campaigns" ADD CONSTRAINT "notification_campaigns_ownerTenantId_fkey" FOREIGN KEY ("ownerTenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_campaign_recipients" ADD CONSTRAINT "notification_campaign_recipients_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "notification_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notification_deliveries" ADD CONSTRAINT "notification_deliveries_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "notification_campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;
