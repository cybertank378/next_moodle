import "server-only";

import { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import { GetStudentDashboardUseCase } from "@/modules/dashboard/application/usecases/GetStudentDashboardUseCase";
import { GetTeacherDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTeacherDashboardUseCase";
import { GetTenantDashboardUseCase } from "@/modules/dashboard/application/usecases/GetTenantDashboardUseCase";
import { GetProctorDashboardUseCase } from "@/modules/dashboard/application/usecases/GetProctorDashboardUseCase";
import { DashboardController } from "@/modules/dashboard/infrastructure/http/DashboardController";
import { PrismaDashboardRepository } from "@/modules/dashboard/infrastructure/repo/PrismaDashboardRepository";

let _controller: DashboardController | null = null;

export function getDashboardController(): DashboardController {
  if (!_controller) {
    const repo = new PrismaDashboardRepository();
    _controller = new DashboardController(
      new GetAdminDashboardUseCase(repo),
      new GetStudentDashboardUseCase(),
      new GetTeacherDashboardUseCase(),
      new GetTenantDashboardUseCase(),
      new GetProctorDashboardUseCase()
    );
  }
  return _controller;
}
