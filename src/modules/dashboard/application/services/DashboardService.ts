import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import { GetAdminDashboardUseCase } from "@/modules/dashboard/application/usecases/GetAdminDashboardUseCase";
import {
  GetProctorDashboardUseCase,
  type GetProctorDashboardRequest,
} from "@/modules/dashboard/application/usecases/GetProctorDashboardUseCase";
import {
  GetStudentDashboardUseCase,
  type GetStudentDashboardRequest,
} from "@/modules/dashboard/application/usecases/GetStudentDashboardUseCase";
import {
  GetTeacherDashboardUseCase,
  type GetTeacherDashboardRequest,
} from "@/modules/dashboard/application/usecases/GetTeacherDashboardUseCase";
import {
  GetTenantDashboardUseCase,
  type GetTenantDashboardRequest,
} from "@/modules/dashboard/application/usecases/GetTenantDashboardUseCase";
import type { GetAdminDashboardRequestDto } from "@/modules/dashboard/domain/dto/DashboardRequestDto";
import type {
  AdminDashboardResponseDto,
  ProctorDashboardResponseDto,
  StudentDashboardResponseDto,
  TeacherDashboardResponseDto,
  TenantDashboardResponseDto,
} from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import type { DashboardRepositoryInterface } from "@/modules/dashboard/domain/interfaces/DashboardRepositoryInterface";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";
import type { QuizRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizRepositoryInterface";
import type { TenantsRepository } from "@/modules/tenant/domain/interfaces/TenantInterfaces";
import type { UserRepositoryInterface } from "@/modules/user/domain/interfaces/UserRepositoryInterface";

/* ============================================================
 * DASHBOARD SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Dashboard Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export interface DashboardServiceDependencies {
  readonly adminDashboard?: GetAdminDashboardUseCase;
  readonly proctorDashboard?: GetProctorDashboardUseCase;
  readonly studentDashboard?: GetStudentDashboardUseCase;
  readonly teacherDashboard?: GetTeacherDashboardUseCase;
  readonly tenantDashboard?: GetTenantDashboardUseCase;
}

export class DashboardService extends BaseService {
  private readonly adminDashboardUseCase: GetAdminDashboardUseCase;
  private readonly proctorDashboardUseCase: GetProctorDashboardUseCase;
  private readonly studentDashboardUseCase?: GetStudentDashboardUseCase;
  private readonly teacherDashboardUseCase?: GetTeacherDashboardUseCase;
  private readonly tenantDashboardUseCase?: GetTenantDashboardUseCase;

  constructor(deps: DashboardServiceDependencies) {
    super();

    this.adminDashboardUseCase = deps.adminDashboard!;
    this.proctorDashboardUseCase = deps.proctorDashboard ?? new GetProctorDashboardUseCase();
    this.studentDashboardUseCase = deps.studentDashboard;
    this.teacherDashboardUseCase = deps.teacherDashboard;
    this.tenantDashboardUseCase = deps.tenantDashboard;
  }

  getAdminDashboard(
    input: GetAdminDashboardRequestDto,
  ): Promise<Result<AdminDashboardResponseDto, Error>> {
    return this.execute(() => this.adminDashboardUseCase.execute(input));
  }

  getProctorDashboard(
    input: GetProctorDashboardRequest,
  ): Promise<Result<ProctorDashboardResponseDto>> {
    return this.execute(() => this.proctorDashboardUseCase.execute(input));
  }

  getStudentDashboard(
    input: GetStudentDashboardRequest,
  ): Promise<Result<StudentDashboardResponseDto>> {
    if (!this.studentDashboardUseCase) {
      throw new Error("StudentDashboardUseCase not configured");
    }
    return this.execute(() => this.studentDashboardUseCase!.execute(input));
  }

  getTeacherDashboard(
    input: GetTeacherDashboardRequest,
  ): Promise<Result<TeacherDashboardResponseDto>> {
    if (!this.teacherDashboardUseCase) {
      throw new Error("TeacherDashboardUseCase not configured");
    }
    return this.execute(() => this.teacherDashboardUseCase!.execute(input));
  }

  getTenantDashboard(
    input: GetTenantDashboardRequest,
  ): Promise<Result<TenantDashboardResponseDto>> {
    if (!this.tenantDashboardUseCase) {
      throw new Error("TenantDashboardUseCase not configured");
    }
    return this.execute(() => this.tenantDashboardUseCase!.execute(input));
  }
}

