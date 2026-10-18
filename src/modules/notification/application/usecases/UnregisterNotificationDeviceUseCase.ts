// Files: src/modules/notification/application/usecases/UnregisterNotificationDeviceUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationDeviceRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";

export interface UnregisterNotificationDeviceInput {
  token: string;
}

export class UnregisterNotificationDeviceUseCase extends BaseUseCase<
  UnregisterNotificationDeviceInput,
  void
> {
  constructor(
    private readonly deviceRepo: NotificationDeviceRepositoryInterface,
  ) {
    super();
  }

  async handle(input: UnregisterNotificationDeviceInput): Promise<void> {
    const trimmed = input.token?.trim();
    if (!trimmed) {
      throw new ValidationError("Token perangkat wajib diisi.");
    }

    await this.deviceRepo.unregister(trimmed);
  }

  override execute(token: string): Promise<void>;
  override execute(input: UnregisterNotificationDeviceInput): Promise<void>;
  override async execute(
    tokenOrInput: string | UnregisterNotificationDeviceInput,
  ): Promise<void> {
    if (typeof tokenOrInput === "string") {
      return this.handle({ token: tokenOrInput });
    }
    return this.handle(tokenOrInput);
  }
}

