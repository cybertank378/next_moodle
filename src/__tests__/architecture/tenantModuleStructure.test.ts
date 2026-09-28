import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const root = process.cwd();

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(root, relativePath));
}

function containsFiles(relativePath: string): boolean {
  const absolutePath = path.join(root, relativePath);
  if (!fs.existsSync(absolutePath)) return false;
  return fs
    .readdirSync(absolutePath, { recursive: true, withFileTypes: true })
    .some((entry) => entry.isFile());
}

describe("tenant module structure", () => {
  it("uses one canonical singular tenant module", () => {
    expect(exists("src/modules/tenant")).toBe(true);
    expect(containsFiles("src/modules/tenants")).toBe(false);
  });

  it("places tenant responsibilities in the agreed DDD folders", () => {
    const requiredPaths = [
      "src/modules/tenant/application/services/TenantAuthorizationService.ts",
      "src/modules/tenant/application/usecases/CreateTenantUseCase.ts",
      "src/modules/tenant/application/usecases/DeleteTenantUseCase.ts",
      "src/modules/tenant/application/usecases/GetTenantByIdUseCase.ts",
      "src/modules/tenant/application/usecases/GetAllTenantsUseCase.ts",
      "src/modules/tenant/application/usecases/UpdateTenantUseCase.ts",
      "src/modules/tenant/domain/builder/TenantBuilder.ts",
      "src/modules/tenant/domain/dto/TenantRequestDto.ts",
      "src/modules/tenant/domain/dto/TenantResponseDto.ts",
      "src/modules/tenant/domain/entity/TenantEntity.ts",
      "src/modules/tenant/domain/interfaces/TenantInterfaces.ts",
      "src/modules/tenant/domain/mapper/TenantMapper.ts",
      "src/modules/tenant/domain/normalizers/TenantNormalizer.ts",
      "src/modules/tenant/domain/types/TenantMetadata.ts",
      "src/modules/tenant/domain/validators/TenantValidator.ts",
      "src/modules/tenant/infrastructure/http/TenantController.ts",
      "src/modules/tenant/infrastructure/repo/TenantRepository.ts",
      "src/modules/tenant/infrastructure/validators/tenant.validator.ts",
      "src/modules/tenant/presentation/hooks/useTenantApi.ts",
      "src/modules/tenant/__tests__/application/TenantUseCases.test.ts",
      "src/modules/tenant/__tests__/domain/TenantMapper.test.ts",
      "src/modules/tenant/__tests__/infrastructure/PrismaMoodleCredentialStore.test.ts",
    ];

    expect(
      requiredPaths.filter((requiredPath) => !exists(requiredPath)),
    ).toEqual([]);
  });

  it("ensures domain and application layers do not import Prisma directly", () => {
    const scanDirs = [
      path.join(root, "src/modules/tenant/domain"),
      path.join(root, "src/modules/tenant/application"),
    ];

    for (const dir of scanDirs) {
      const files = fs.readdirSync(dir, { recursive: true }) as string[];
      for (const file of files) {
        if (file.endsWith(".ts") && !file.includes("__tests__")) {
          const content = fs.readFileSync(path.join(dir, file), "utf8");
          expect(content).not.toMatch(/from\s+['"]@prisma/);
          expect(content).not.toMatch(/from\s+['"][^'"]*prisma['"]/);
        }
      }
    }
  });
});
