import "server-only";
import { GetPlatformSettingsUseCase } from "@/modules/settings/application/usecases/GetPlatformSettingsUseCase";
import { UpdatePlatformSettingsUseCase } from "@/modules/settings/application/usecases/UpdatePlatformSettingsUseCase";
import { PrismaPlatformSettingsRepository } from "@/modules/settings/infrastructure/repo/PrismaPlatformSettingsRepository";

export function createSettingsUseCases(){
  const repository = new PrismaPlatformSettingsRepository();
  return {
    read: new GetPlatformSettingsUseCase(repository),
    update: new UpdatePlatformSettingsUseCase(repository),
  };
}
