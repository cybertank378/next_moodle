-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('EXAM_RESULT_AVAILABLE', 'ASSIGNMENT_SUBMITTED', 'ASSIGNMENT_GRADED', 'STUDENT_ENROLLED', 'STUDENT_IMPORT_COMPLETE', 'STUDENT_IMPORT_FAILED', 'TENANT_REGISTERED', 'CREDENTIAL_FAILED', 'SYSTEM_ERROR', 'ANNOUNCEMENT');

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "tenantId" TEXT,
    "recipientId" TEXT NOT NULL,
    "recipientRole" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "linkPath" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "notifications_tenantId_recipientId_recipientRole_isRead_idx" ON "notifications"("tenantId", "recipientId", "recipientRole", "isRead");

-- CreateIndex
CREATE INDEX "notifications_tenantId_recipientId_createdAt_idx" ON "notifications"("tenantId", "recipientId", "createdAt");

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
