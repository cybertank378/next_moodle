import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  GetPlatformSettingsUseCase,
  type GetPlatformSettingsInput,
} from "@/modules/settings/application/usecases/GetPlatformSettingsUseCase";
import {
  UpdatePlatformSettingsUseCase,
  type UpdatePlatformSettingsInput,
} from "@/modules/settings/application/usecases/UpdatePlatformSettingsUseCase";
import type { PlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";
import type { PlatformSettingsRepositoryInterface } from "@/modules/settings/domain/interfaces/PlatformSettingsRepositoryInterface";

/* ============================================================
 * SETTINGS SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Settings Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class SettingsService extends BaseService {
  private readonly getPlatformSettingsUseCase: GetPlatformSettingsUseCase;
  private readonly updatePlatformSettingsUseCase: UpdatePlatformSettingsUseCase;

  constructor(repo: PlatformSettingsRepositoryInterface) {
    super();

    this.getPlatformSettingsUseCase = new GetPlatformSettingsUseCase(repo);
    this.updatePlatformSettingsUseCase = new UpdatePlatformSettingsUseCase(repo);
  }

  getPlatformSettings(
    input: GetPlatformSettingsInput,
  ): Promise<Result<PlatformSettingsDTO, Error>> {
    return this.execute(() => this.getPlatformSettingsUseCase.execute(input));
  }

  updatePlatformSettings(
    input: UpdatePlatformSettingsInput,
  ): Promise<Result<PlatformSettingsDTO, Error>> {
    return this.execute(() =>
      this.updatePlatformSettingsUseCase.execute(input),
    );
  }
}

