import "server-only";

import { prisma } from "@/libs/prisma";
import { ConfigureTenantCredentialUseCase } from "@/modules/tenant/application/usecases/ConfigureTenantCredentialUseCase";
import { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import { DeleteTenantUseCase } from "@/modules/tenant/application/usecases/DeleteTenantUseCase";
import { GetAllTenantsUseCase } from "@/modules/tenant/application/usecases/GetAllTenantsUseCase";
import { GetTenantByIdUseCase } from "@/modules/tenant/application/usecases/GetTenantByIdUseCase";
import { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { TenantController } from "@/modules/tenant/infrastructure/http/TenantController";
import { AesTenantCredentialCipher } from "@/modules/tenant/infrastructure/providers/AesTenantCredentialCipher";
import { TenantRepository } from "@/modules/tenant/infrastructure/repo/TenantRepository";

let controller: TenantController | null = null;

export function getTenantsController(): TenantController {
  if (controller) return controller;

  const repository = new TenantRepository(prisma);
  const cipher = new AesTenantCredentialCipher();

  controller = new TenantController(
    new GetAllTenantsUseCase(repository),
    new GetTenantByIdUseCase(repository),
    new CreateTenantUseCase(repository),
    new UpdateTenantUseCase(repository),
    new UpdateTenantStatusUseCase(repository),
    new DeleteTenantUseCase(repository),
    new ConfigureTenantCredentialUseCase(repository, cipher),
  );
  return controller;
}
