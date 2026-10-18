import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { authorizeSettings } from "@/modules/settings/application/services/SettingsAuthorization";
import type { PlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";
import { validatePlatformSettingsUpdate } from "@/modules/settings/domain/validators/validatePlatformSettings";

export interface UpdatePlatformSettingsInput {
  actor: CurrentActor | null;
  input: unknown;
}

export class UpdatePlatformSettingsUseCase extends BaseUseCase<
  UpdatePlatformSettingsInput,
  PlatformSettingsDTO
> {
  constructor(
    private readonly repository: PlatformSettingsRepositoryInterface,
  ) {
    super();
  }

  override execute(input: UpdatePlatformSettingsInput): Promise<PlatformSettingsDTO>;
  override execute(
    actor: CurrentActor | null,
    input: unknown,
  ): Promise<PlatformSettingsDTO>;
  override async execute(
    inputOrActor: UpdatePlatformSettingsInput | CurrentActor | null,
    maybeInput?: unknown,
  ): Promise<PlatformSettingsDTO> {
    const input: UpdatePlatformSettingsInput =
      inputOrActor && "actor" in inputOrActor && "input" in inputOrActor
        ? (inputOrActor as UpdatePlatformSettingsInput)
        : { actor: inputOrActor as CurrentActor | null, input: maybeInput };
    return this.handle(input);
  }

  async handle(input: UpdatePlatformSettingsInput): Promise<PlatformSettingsDTO> {
    authorizeSettings(input.actor, "update");
    return this.repository.update(
      validatePlatformSettingsUpdate(input.input),
      input.actor!.userId,
    );
  }
}


