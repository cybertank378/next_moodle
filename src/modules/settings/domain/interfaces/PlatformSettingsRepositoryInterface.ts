import type { PlatformSettingsDTO, UpdatePlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";

export interface PlatformSettingsRepositoryInterface {
  get(): Promise<PlatformSettingsDTO>;
  update(input: UpdatePlatformSettingsDTO, actorId: string): Promise<PlatformSettingsDTO>;
}
