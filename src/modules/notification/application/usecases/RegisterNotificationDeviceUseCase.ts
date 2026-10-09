// Files: src/modules/notification/application/usecases/RegisterNotificationDeviceUseCase.ts

import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationDeviceRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";

export interface RegisterDeviceActor {
  id: string;
  role: string;
  tenantId: string | null;
}

export class RegisterNotificationDeviceUseCase {
  constructor(
    private readonly deviceRepo: NotificationDeviceRepositoryInterface,
  ) {}

  async execute(
    dto: { token: string; platform?: string },
    actor: RegisterDeviceActor,
  ): Promise<void> {
    const token = dto.token?.trim();
    if (!token) {
      throw new ValidationError("Token perangkat FCM wajib diisi.");
    }

    await this.deviceRepo.register({
      userId: actor.id,
      role: actor.role,
      tenantId: actor.tenantId,
      token,
      platform: dto.platform || "web",
    });
  }
}
