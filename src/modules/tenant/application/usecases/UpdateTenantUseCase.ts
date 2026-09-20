import crypto from "node:crypto";
import { NotFoundError } from "@/core/errors/NotFoundError";
import type { TenantResponseDTO } from "@/modules/tenant/domain/dto/TenantResponseDTO";
import type { UpdateTenantRequestDTO } from "@/modules/tenant/domain/dto/UpdateTenantRequestDTO";
import { Tenant } from "@/modules/tenant/domain/entities/Tenant";
import type { TenantCredentialRepository } from "@/modules/tenant/domain/interfaces/TenantCredentialRepository";
import type { TenantRepository } from "@/modules/tenant/domain/interfaces/TenantRepository";
import { TenantValidator } from "@/modules/tenant/domain/validators/TenantValidator";
import {
  type AesGcmEncryptionProvider,
  defaultEncryptionProvider,
} from "@/modules/tenant/infrastructure/providers/AesGcmEncryptionProvider";

export class UpdateTenantUseCase {
  constructor(
    private readonly tenantRepository: TenantRepository,
    private readonly credentialRepository: TenantCredentialRepository,
    private readonly encryptionProvider: AesGcmEncryptionProvider = defaultEncryptionProvider,
  ) {}

  public async execute(
    tenantId: string,
    dto: UpdateTenantRequestDTO,
  ): Promise<TenantResponseDTO> {
    const existing = await this.tenantRepository.findById(tenantId);
    if (!existing) {
      throw new NotFoundError(`Tenant '${tenantId}' tidak ditemukan.`, {
        code: "TENANT_NOT_FOUND",
      });
    }

    const name =
      dto.name !== undefined
        ? TenantValidator.validateName(dto.name)
        : existing.name;
    const moodleBaseUrl =
      dto.moodleBaseUrl !== undefined
        ? TenantValidator.validateMoodleBaseUrl(dto.moodleBaseUrl)
        : existing.moodleBaseUrl;
    const status =
      dto.status !== undefined
        ? TenantValidator.validateStatus(dto.status)
        : existing.status;
    const moodleServiceShortname =
      dto.moodleServiceShortname !== undefined
        ? dto.moodleServiceShortname
        : existing.moodleServiceShortname;

    const updated = new Tenant({
      id: existing.id,
      slug: existing.slug,
      name,
      status,
      moodleBaseUrl,
      moodleServiceShortname,
      createdAt: existing.createdAt,
      updatedAt: new Date(),
    });

    // Update credential only if explicitly supplied
    if (dto.moodleToken?.trim()) {
      const encrypted = this.encryptionProvider.encrypt(dto.moodleToken.trim());
      await this.credentialRepository.save({
        id: `cred_${crypto.randomUUID()}`,
        tenantId,
        encryptedToken: encrypted.encryptedValue,
        iv: encrypted.iv,
        authTag: encrypted.authTag,
        keyVersion: encrypted.keyVersion,
      });
    }

    await this.tenantRepository.update(updated);

    return {
      id: updated.id,
      slug: updated.slug,
      name: updated.name,
      status: updated.status,
      moodle: {
        baseUrl: updated.moodleBaseUrl,
        serviceShortname: updated.moodleServiceShortname,
        configured: true,
      },
      createdAt: updated.createdAt.toISOString(),
      updatedAt: updated.updatedAt.toISOString(),
    };
  }
}
