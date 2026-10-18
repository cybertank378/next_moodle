// Files: src/modules/notification/application/usecases/RegisterNotificationDeviceUseCase.ts

import { BaseUseCase } from "@/core/base/BaseUseCase";
import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationDeviceRepositoryInterface } from "@/modules/notification/domain/interfaces/NotificationDeviceRepositoryInterface";

export interface RegisterDeviceActor {
  id: string;
  role: string;
  tenantId: string | null;
}

export interface RegisterNotificationDeviceInput {
  dto: { token: string; platform?: string };
  actor: RegisterDeviceActor;
}

export class RegisterNotificationDeviceUseCase extends BaseUseCase<
  RegisterNotificationDeviceInput,
  void
> {
  constructor(
    private readonly deviceRepo: NotificationDeviceRepositoryInterface,
  ) {
    super();
  }

  async handle(input: RegisterNotificationDeviceInput): Promise<void> {
    const { dto, actor } = input;
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

  override execute(
    dto: { token: string; platform?: string },
    actor: RegisterDeviceActor,
  ): Promise<void>;
  override execute(input: RegisterNotificationDeviceInput): Promise<void>;
  override async execute(
    dtoOrInput:
      | { token: string; platform?: string }
      | RegisterNotificationDeviceInput,
    actor?: RegisterDeviceActor,
  ): Promise<void> {
    if ("dto" in dtoOrInput && "actor" in dtoOrInput) {
      return this.handle(dtoOrInput as RegisterNotificationDeviceInput);
    }
    return this.handle({
      dto: dtoOrInput as { token: string; platform?: string },
      actor: actor!,
    });
  }
}

