import { BaseUseCase } from "@/core/base/BaseUseCase";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { authorizeSettings } from "@/modules/settings/application/services/SettingsAuthorization";
import type { PlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";

export interface GetPlatformSettingsInput {
  actor: CurrentActor | null;
}

export class GetPlatformSettingsUseCase extends BaseUseCase<
  GetPlatformSettingsInput,
  PlatformSettingsDTO
> {
  constructor(
    private readonly repository: PlatformSettingsRepositoryInterface,
  ) {
    super();
  }

  override execute(input: GetPlatformSettingsInput): Promise<PlatformSettingsDTO>;
  override execute(actor: CurrentActor | null): Promise<PlatformSettingsDTO>;
  override async execute(
    inputOrActor: GetPlatformSettingsInput | CurrentActor | null,
  ): Promise<PlatformSettingsDTO> {
    const input: GetPlatformSettingsInput =
      inputOrActor && "actor" in inputOrActor
        ? (inputOrActor as GetPlatformSettingsInput)
        : { actor: inputOrActor as CurrentActor | null };
    return this.handle(input);
  }

  async handle(input: GetPlatformSettingsInput): Promise<PlatformSettingsDTO> {
    authorizeSettings(input.actor, "read");
    return this.repository.get();
  }
}


