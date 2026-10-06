// Files: src/modules/notification/application/usecases/UnregisterNotificationDeviceUseCase.ts

import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationDeviceRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";

export class UnregisterNotificationDeviceUseCase {
  constructor(
    private readonly deviceRepo: NotificationDeviceRepositoryInterface,
  ) {}

  async execute(token: string): Promise<void> {
    const trimmed = token?.trim();
    if (!trimmed) {
      throw new ValidationError("Token perangkat wajib diisi.");
    }

    await this.deviceRepo.unregister(trimmed);
  }
}
