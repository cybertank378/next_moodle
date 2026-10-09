import type { CurrentActor } from "@/core/auth/CurrentActor";
import { authorizeSettings } from "@/modules/settings/application/services/SettingsAuthorization";
import { validatePlatformSettingsUpdate } from "@/modules/settings/domain/validators/validatePlatformSettings";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";

export class UpdatePlatformSettingsUseCase {
  constructor(private readonly repository: PlatformSettingsRepositoryInterface) {}
  async execute(actor: CurrentActor | null, input: unknown) {
    authorizeSettings(actor, "update");
    return this.repository.update(validatePlatformSettingsUpdate(input), actor!.userId);
  }
}
