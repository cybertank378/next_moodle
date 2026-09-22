import { Result } from "@/core/base/Result";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import { authorize } from "@/core/rbac/authorize";
import { Permission } from "@/core/rbac/Permission";
import type {
  ListTenantsResponseDTO,
  TenantSummaryResponseDTO,
} from "@/modules/tenant/domain/TenantDTOs";
import { TenantMapper } from "@/modules/tenant/domain/TenantMapper";
import type { TenantRepository } from "@/modules/tenant/domain/TenantRepository";
import type { TenantListFilter } from "@/modules/tenant/domain/TenantTypes";

export interface GetTenantsInput {
  actor: AuthorizationActor | null | undefined;
  filter?: TenantListFilter;
}

export class GetTenantsUseCase {
  constructor(private readonly repo: TenantRepository) {}

  async execute(
    input: GetTenantsInput,
  ): Promise<Result<ListTenantsResponseDTO>> {
    try {
      authorize(input.actor, Permission.TENANT_READ);
    } catch (err) {
      if (
        err instanceof AuthorizationError ||
        err instanceof UnauthorizedError
      ) {
        return Result.fail(err);
      }
      throw err;
    }

    const page = Math.max(1, input.filter?.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, input.filter?.pageSize ?? 20));

    const [tenants, total] = await Promise.all([
      this.repo.findAll({
        filter: {
          status: input.filter?.status,
          search: input.filter?.search,
          page,
          pageSize,
        },
      }),
      this.repo.count({
        filter: {
          status: input.filter?.status,
          search: input.filter?.search,
        },
      }),
    ]);

    const dtos: TenantSummaryResponseDTO[] = tenants.map((t) =>
      TenantMapper.toSummaryDTO(t),
    );

    return Result.ok<ListTenantsResponseDTO>({
      tenants: dtos,
      total,
      page,
      pageSize,
    });
  }
}
