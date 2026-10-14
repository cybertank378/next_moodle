import "server-only";
import { GetPlatformSettingsUseCase } from "@/modules/settings/application/usecases/GetPlatformSettingsUseCase";
import { UpdatePlatformSettingsUseCase } from "@/modules/settings/application/usecases/UpdatePlatformSettingsUseCase";
import { SettingsController } from "@/modules/settings/infrastructure/http/SettingsController";
import { PrismaPlatformSettingsRepository } from "@/modules/settings/infrastructure/repo/PrismaPlatformSettingsRepository";

const repository = new PrismaPlatformSettingsRepository();
const read = new GetPlatformSettingsUseCase(repository);
const update = new UpdatePlatformSettingsUseCase(repository);
const controller = new SettingsController(read, update);

export function getSettingsController(): SettingsController {
  return controller;
}

export function createSettingsUseCases() {
  return {
    read,
    update,
  };
}
