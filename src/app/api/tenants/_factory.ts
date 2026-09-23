import "server-only";

import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";
import { prisma } from "@/libs/prisma";
import { ConfigureTenantCredentialUseCase } from "@/modules/tenants/application/usecases/ConfigureTenantCredentialUseCase";
import { CreateTenantUseCase } from "@/modules/tenants/application/usecases/CreateTenantUseCase";
import { DeleteTenantUseCase } from "@/modules/tenants/application/usecases/DeleteTenantUseCase";
import { GetTenantUseCase } from "@/modules/tenants/application/usecases/GetTenantUseCase";
import { ListTenantsUseCase } from "@/modules/tenants/application/usecases/ListTenantsUseCase";
import { UpdateTenantStatusUseCase } from "@/modules/tenants/application/usecases/UpdateTenantStatusUseCase";
import { UpdateTenantUseCase } from "@/modules/tenants/application/usecases/UpdateTenantUseCase";
import { AesTenantCredentialCipher } from "@/modules/tenants/infrastructure/AesTenantCredentialCipher";
import { TenantsController } from "@/modules/tenants/infrastructure/http/TenantsController";
import { PrismaTenantsRepository } from "@/modules/tenants/infrastructure/PrismaTenantsRepository";

let controller: TenantsController | null = null;

export function getTenantsController(): TenantsController {
  if (controller) return controller;

  const repository = new PrismaTenantsRepository(prisma);
  const cipher = new AesTenantCredentialCipher(new AesHkdfEncryptionProvider());

  controller = new TenantsController(
    new ListTenantsUseCase(repository),
    new GetTenantUseCase(repository),
    new CreateTenantUseCase(repository),
    new UpdateTenantUseCase(repository),
    new UpdateTenantStatusUseCase(repository),
    new DeleteTenantUseCase(repository),
    new ConfigureTenantCredentialUseCase(repository, cipher),
  );
  return controller;
}
