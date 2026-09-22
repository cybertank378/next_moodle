import "server-only";

import { prisma } from "@/libs/prisma";
import { CreateTenantUseCase } from "@/modules/tenant/application/usecases/CreateTenantUseCase";
import { GetTenantsUseCase } from "@/modules/tenant/application/usecases/GetTenantsUseCase";
import { GetTenantUseCase } from "@/modules/tenant/application/usecases/GetTenantUseCase";
import { UpdateTenantStatusUseCase } from "@/modules/tenant/application/usecases/UpdateTenantStatusUseCase";
import { UpdateTenantUseCase } from "@/modules/tenant/application/usecases/UpdateTenantUseCase";
import { TenantController } from "@/modules/tenant/infrastructure/http/TenantController";
import { PrismaTenantRepository } from "@/modules/tenant/infrastructure/PrismaTenantRepository";

function buildTenantController(): TenantController {
  const repo = new PrismaTenantRepository(prisma);

  const getTenantsUseCase = new GetTenantsUseCase(repo);
  const getTenantUseCase = new GetTenantUseCase(repo);
  const createTenantUseCase = new CreateTenantUseCase(repo);
  const updateTenantUseCase = new UpdateTenantUseCase(repo);
  const updateTenantStatusUseCase = new UpdateTenantStatusUseCase(repo);

  return new TenantController(
    getTenantsUseCase,
    getTenantUseCase,
    createTenantUseCase,
    updateTenantUseCase,
    updateTenantStatusUseCase,
  );
}

// Singleton per request lifecycle (Next.js module caching)
let _controller: TenantController | null = null;

export function getTenantController(): TenantController {
  if (!_controller) {
    _controller = buildTenantController();
  }
  return _controller;
}
