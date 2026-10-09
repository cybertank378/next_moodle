import type { CurrentActor } from "@/core/auth/CurrentActor";
import { authorizeSettings } from "@/modules/settings/application/services/SettingsAuthorization";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";

export class GetPlatformSettingsUseCase {
  constructor(private readonly repository: PlatformSettingsRepositoryInterface) {}
  async execute(actor: CurrentActor | null) {
    authorizeSettings(actor, "read");
    return this.repository.get();
  }
}
