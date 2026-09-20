import crypto from "node:crypto";
import { ConflictError } from "@/core/errors/ConflictError";
import { ValidationError } from "@/core/errors/ValidationError";
import type { CreateTenantRequestDTO } from "@/modules/tenant/domain/dto/CreateTenantRequestDTO";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantCredentialRepository } from "@/modules/tenant/domain/interfaces/TenantCredentialRepository";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";
import {
  type AesGcmEncryptionProvider,
  defaultEncryptionProvider,
} from "@/modules/tenant/infrastructure/providers/AesGcmEncryptionProvider";

export class CreateTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly credentialRepository: TenantCredentialRepository,
    private readonly encryptionProvider: AesGcmEncryptionProvider = defaultEncryptionProvider,
  ) {}

  public async execute(
    dto: CreateTenantRequestDTO,
  ): Promise<TenantResponseDTO> {
    const slug = TenantValidator.validateSlug(dto.slug);
    const name = TenantValidator.validateName(dto.name);
    const moodleBaseUrl = TenantValidator.validateMoodleBaseUrl(
      dto.moodleBaseUrl,
    );

    if (!dto.moodleToken || typeof dto.moodleToken !== "string") {
      throw new ValidationError("Moodle token wajib diisi untuk tenant baru.", {
        code: "TENANT_CONFIGURATION_INVALID",
        field: "moodleToken",
      });
    }

    const exists = await this.tenantRepository.existsBySlug(slug);
    if (exists) {
      throw new ConflictError(`Tenant dengan slug '${slug}' sudah ada.`, {
        code: "TENANT_SLUG_EXISTS",
      });
    }

    const tenantId = `tenant_${crypto.randomUUID()}`;
    const status = dto.status ?? "ACTIVE";

    const tenant = new Tenant({
      id: tenantId,
      slug,
      name,
      status,
      moodleBaseUrl,
      moodleServiceShortname: dto.moodleServiceShortname ?? null,
      createdAt: new Date(),
    });

    // 1. Encrypt and save credential
    const encrypted = this.encryptionProvider.encrypt(dto.moodleToken);
    await this.credentialRepository.save({
      id: `cred_${crypto.randomUUID()}`,
      tenantId,
      encryptedToken: encrypted.encryptedValue,
      iv: encrypted.iv,
      authTag: encrypted.authTag,
      keyVersion: encrypted.keyVersion,
    });

    // 2. Persist tenant metadata
    await this.tenantRepository.create(tenant);

    return {
      id: tenant.id,
      slug: tenant.slug,
      name: tenant.name,
      status: tenant.status,
      moodle: {
        baseUrl: tenant.moodleBaseUrl,
        serviceShortname: tenant.moodleServiceShortname,
        configured: true,
      },
      createdAt: tenant.createdAt.toISOString(),
      updatedAt: tenant.updatedAt.toISOString(),
    };
  }
}
