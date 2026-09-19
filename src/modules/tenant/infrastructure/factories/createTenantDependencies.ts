import { GetTenantUseCase } from "../../application/usecases/GetTenantUseCase";
import { InMemoryTenantRepository } from "../repositories/InMemoryTenantRepository";

const tenantRepository = new InMemoryTenantRepository();

export function createTenantDependencies() {
  const getTenantUseCase = new GetTenantUseCase(tenantRepository);
  return {
    tenantRepository,
    getTenantUseCase,
  };
}
