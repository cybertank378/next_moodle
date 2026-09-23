import { Result } from "@/core/base/Result";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import { authorizeTenantOperation } from "@/modules/tenant/application/services/TenantAuthorizationService";
import type { ConfigureTenantCredentialRequestDTO } from "@/modules/tenant/domain/dto/TenantRequestDto";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDto";
import type {
  TenantCredentialCipher,
  TenantsRepository,
} from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import { TenantMapper } from "@/modules/tenant/domain/mapper/TenantMapper";
import { TenantNormalizer } from "@/modules/tenant/domain/normalizers/TenantNormalizer";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";

export class ConfigureTenantCredentialUseCase {
  constructor(
    private readonly repository: TenantsRepository,
    private readonly cipher: TenantCredentialCipher,
  ) {}

  async execute(input: {
    actor: AuthorizationActor | null | undefined;
    tenantId: string;
    data: ConfigureTenantCredentialRequestDTO;
  }): Promise<Result<TenantResponseDTO, Error>> {
    const authError = authorizeTenantOperation(
      input.actor,
      Permission.TENANT_UPDATE,
    );
    if (authError) return Result.fail(authError);

    if (!(await this.repository.findById(input.tenantId))) {
      return Result.fail(new NotFoundError("Tenant tidak ditemukan."));
    }

    const moodleUrl = TenantNormalizer.moodleUrl(input.data.moodleUrl);
    const timeoutBudgetMs = input.data.timeoutBudgetMs ?? 10000;
    TenantValidator.credential({
      moodleUrl,
      adminToken: input.data.adminToken,
      timeoutBudgetMs,
    });

    const encryptedAdminToken = await this.cipher.encrypt(
      input.data.adminToken,
      input.tenantId,
    );
    const encryptedProctorToken = input.data.proctorToken?.trim()
      ? await this.cipher.encrypt(input.data.proctorToken, input.tenantId)
      : null;

    const saved = await this.repository.upsertCredential({
      tenantId: input.tenantId,
      moodleUrl,
      encryptedAdminToken,
      encryptedProctorToken,
      timeoutBudgetMs,
      sslVerify: input.data.sslVerify ?? true,
    });

    return Result.ok(TenantMapper.toDetailResponse(saved));
  }
}
