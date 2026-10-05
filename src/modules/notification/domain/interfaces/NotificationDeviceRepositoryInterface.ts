// Files: src/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface.ts

export interface NotificationDeviceInput {
  userId: string;
  role: string;
  tenantId: string | null;
  token: string;
  platform?: string;
}

export interface NotificationDeviceRecord {
  id: string;
  userId: string;
  role: string;
  tenantId: string | null;
  token: string;
  platform: string | null;
  active: boolean;
  lastSeenAt: Date;
}

export interface NotificationDeviceRepositoryInterface {
  register(input: NotificationDeviceInput): Promise<void>;
  unregister(token: string): Promise<void>;
  findActiveByRecipients(
    recipients: Array<{ recipientId: string; role: string; tenantId: string | null }>,
  ): Promise<Array<{ userId: string; role: string; token: string; tenantId: string | null }>>;
  findActiveByUserId(userId: string): Promise<NotificationDeviceRecord[]>;
}
