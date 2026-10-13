import { Result } from "@/core/base/Result";
import { ConflictError } from "@/core/errors/ConflictError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import { TenantBuilder } from "@/modules/tenant/domain/builder/TenantBuilder";
import type { CreateTenantRequestDTO } from "@/modules/tenant/domain/dto/TenantRequestDto";
import type {
  TenantsRepository,
  TenantUserProvisioner,
} from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";
import { TenantNormalizer } from "@/modules/tenant/domain/normalizers/TenantNormalizer";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export class CreateTenantUseCase {
  constructor(
    private readonly repository: TenantsRepository,
    private readonly userProvisioner?: TenantUserProvisioner,
  ) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    data: CreateTenantRequestDTO;
  }): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_CREATE,
    );
    if (authError) return Result.fail(authError);

    if (input.data.adminUser) {
      try {
        TenantValidator.adminUser(input.data.adminUser);
      } catch (err) {
        return Result.fail(err instanceof Error ? err : new Error(String(err)));
      }
    }

    const slug = TenantNormalizer.slug(input.data.slug);
    if (await this.repository.findBySlug(slug)) {
      return Result.fail(new ConflictError(`Slug '${slug}' sudah digunakan.`));
    }

    const customDomain = TenantNormalizer.customDomain(input.data.customDomain);
    if (
      customDomain &&
      (await this.repository.findByCustomDomain(customDomain))
    ) {
      return Result.fail(
        new ConflictError(`Domain '${customDomain}' sudah digunakan.`),
      );
    }

    const saved = await this.repository.create(
      TenantBuilder.create({ ...input.data, slug, customDomain }),
    );

    const response = TenantMapper.toDetailResponse(saved);

    if (input.data.adminUser && this.userProvisioner) {
      try {
        const provisioned = await this.userProvisioner.provisionInitialAdmin({
          tenantId: saved.id,
          username: input.data.adminUser.username,
          firstname: input.data.adminUser.firstname,
          lastname: input.data.adminUser.lastname,
          email: input.data.adminUser.email,
          password: input.data.adminUser.password,
        });
        response.initialAdminUser = {
          username: provisioned.username,
          email: provisioned.email,
          fullname:
            `${input.data.adminUser.firstname} ${input.data.adminUser.lastname}`.trim(),
        };
      } catch (_err) {
        // Log or preserve tenant creation even if provisioning fails, or surface initial admin info
        response.initialAdminUser = {
          username: input.data.adminUser.username,
          email: input.data.adminUser.email,
          fullname:
            `${input.data.adminUser.firstname} ${input.data.adminUser.lastname}`.trim(),
        };
      }
    } else if (input.data.adminUser) {
      response.initialAdminUser = {
        username: input.data.adminUser.username,
        email: input.data.adminUser.email,
        fullname:
          `${input.data.adminUser.firstname} ${input.data.adminUser.lastname}`.trim(),
      };
    }

    return Result.ok(response);
  }
}
