import "server-only";

import { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import { DashboardController } from "@/modules/dashboard/infrastructure/http/DashboardController";
import { PrismaDashboardRepository } from "@/modules/dashboard/infrastructure/repo/PrismaDashboardRepository";

let _controller: DashboardController | null = null;

export function getDashboardController(): DashboardController {
  if (!_controller) {
    const repo = new PrismaDashboardRepository();
    _controller = new DashboardController(new GetAdminDashboardUseCase(repo));
  }
  return _controller;
}
