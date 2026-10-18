import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { ConfigureTenantCredentialInput, ConfigureTenantCredentialUseCase } from "@/modules/tenant/application/usecases/ConfigureTenantCredentialUseCase";
import type { CreateTenantInput, CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import type { DeleteTenantInput, DeleteTenantUseCase } from "@/modules/tenant/application/usecases/DeleteTenantUseCase";
import type { GetAllTenantsInput, GetAllTenantsUseCase } from "@/modules/tenant/application/usecases/GetAllTenantsUseCase";
import type { GetTenantByIdInput, GetTenantByIdUseCase } from "@/modules/tenant/application/usecases/GetTenantByIdUseCase";
import type { UpdateTenantStatusInput, UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import type { UpdateTenantInput, UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import type { ListTenantsResponseDTO, TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";

export class TenantService extends BaseService {
  constructor(
    private readonly getAllTenantsUseCase: GetAllTenantsUseCase,
    private readonly getTenantByIdUseCase: GetTenantByIdUseCase,
    private readonly createTenantUseCase: CreateTenantUseCase,
    private readonly updateTenantUseCase: UpdateTenantUseCase,
    private readonly updateTenantStatusUseCase: UpdateTenantStatusUseCase,
    private readonly deleteTenantUseCase: DeleteTenantUseCase,
    private readonly configureTenantCredentialUseCase: ConfigureTenantCredentialUseCase,
  ) {
    super("TenantService");
  }

  async getAllTenants(
    input: GetAllTenantsInput,
  ): Promise<Result<ListTenantsResponseDTO, Error>> {
    return this.execute(() => this.getAllTenantsUseCase.execute(input));
  }

  async getTenantById(
    input: GetTenantByIdInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    return this.execute(() => this.getTenantByIdUseCase.execute(input));
  }

  async createTenant(
    input: CreateTenantInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    return this.execute(() => this.createTenantUseCase.execute(input));
  }

  async updateTenant(
    input: UpdateTenantInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    return this.execute(() => this.updateTenantUseCase.execute(input));
  }

  async updateTenantStatus(
    input: UpdateTenantStatusInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    return this.execute(() => this.updateTenantStatusUseCase.execute(input));
  }

  async deleteTenant(
    input: DeleteTenantInput,
  ): Promise<Result<{ id: string }, Error>> {
    return this.execute(() => this.deleteTenantUseCase.execute(input));
  }

  async configureTenantCredential(
    input: ConfigureTenantCredentialInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    return this.execute(() =>
      this.configureTenantCredentialUseCase.execute(input),
    );
  }
}
