import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import { GetCourseGradesUseCase } from "@/modules/grades/application/usecases/GetCourseGradesUseCase";
import { GetUserGradesUseCase } from "@/modules/grades/application/usecases/GetUserGradesUseCase";
import type {
  GetCourseGradesRequestDto,
  GetUserGradesRequestDto,
} from "@/modules/grades/domain/dto/GradeRequestDto";
import type {
  CourseGradesResponseDto,
  UserGradeReportResponseDto,
} from "@/modules/grades/domain/dto/GradeResponseDto";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";

/* ============================================================
 * GRADE SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Grade Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class GradeService extends BaseService {
  private readonly getCourseGradesUseCase: GetCourseGradesUseCase;
  private readonly getUserGradesUseCase: GetUserGradesUseCase;

  constructor(repo: GradeRepositoryInterface) {
    super();

    this.getCourseGradesUseCase = new GetCourseGradesUseCase(repo);
    this.getUserGradesUseCase = new GetUserGradesUseCase(repo);
  }

  getCourseGrades(
    dto: GetCourseGradesRequestDto,
  ): Promise<Result<CourseGradesResponseDto, Error>> {
    return this.execute(() => this.getCourseGradesUseCase.execute(dto));
  }

  getUserGrades(
    dto: GetUserGradesRequestDto,
  ): Promise<Result<UserGradeReportResponseDto, Error>> {
    return this.execute(() => this.getUserGradesUseCase.execute(dto));
  }
}
