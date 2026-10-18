import { BaseUseCase } from "@/core/base/BaseUseCase";
import { Result } from "@/core/base/Result";
import { ConflictError } from "@/core/errors/ConflictError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { UpdateTenantRequestDTO } from "@/modules/tenant/domain/dto/TenantRequestDto";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";
import { TenantNormalizer } from "@/modules/tenant/domain/normalizers/TenantNormalizer";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export interface UpdateTenantInput {
  actor: AuthorizationActor | null | undefined;
  tenantId: string;
  data: UpdateTenantRequestDTO;
}

export class UpdateTenantUseCase extends BaseUseCase<
  UpdateTenantInput,
  Result<TenantResponseDTO, Error>
> {
  constructor(private readonly repository: TenantsRepository) {
    super();
  }

  async handle(
    input: UpdateTenantInput,
  ): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_UPDATE,
    );
    if (authError) return Result.fail(authError);

    const tenant = await this.repository.findById(input.tenantId);
    if (!tenant)
      return Result.fail(new NotFoundError("Tenant tidak ditemukan."));
    if (
      input.data.name === undefined &&
      input.data.customDomain === undefined
    ) {
      return Result.fail(
        new ValidationError("Tidak ada perubahan tenant yang diberikan."),
      );
    }

    const name =
      input.data.name !== undefined
        ? TenantNormalizer.name(input.data.name)
        : undefined;
    if (name !== undefined) TenantValidator.name(name);

    const customDomain =
      input.data.customDomain !== undefined
        ? TenantNormalizer.customDomain(input.data.customDomain)
        : undefined;

    if (customDomain && customDomain !== tenant.customDomain) {
      const duplicate = await this.repository.findByCustomDomain(customDomain);
      if (duplicate && duplicate.id !== tenant.id) {
        return Result.fail(
          new ConflictError(`Domain '${customDomain}' sudah digunakan.`),
        );
      }
    }

    const saved = await this.repository.update(
      tenant.withUpdate({ name, customDomain }),
    );
    return Result.ok(TenantMapper.toDetailResponse(saved));
  }
}
