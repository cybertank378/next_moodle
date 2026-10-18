import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  GetCourseContentsUseCase,
  type GetCourseContentsInput,
} from "@/modules/course/application/usecases/GetCourseContentsUseCase";
import {
  GetCourseDetailUseCase,
  type GetCourseDetailInput,
} from "@/modules/course/application/usecases/GetCourseDetailUseCase";
import {
  GetUserCoursesUseCase,
  type GetUserCoursesInput,
} from "@/modules/course/application/usecases/GetUserCoursesUseCase";
import type {
  CourseDetailResponseDTO,
  CourseListResponseDTO,
  CourseSectionResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import type { CourseRepositoryInterface } from "@/modules/course/domain/interfaces/CourseRepositoryInterface";

/* ============================================================
 * COURSE SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Course Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class CourseService extends BaseService {
  private readonly getUserCoursesUseCase: GetUserCoursesUseCase;
  private readonly getCourseContentsUseCase: GetCourseContentsUseCase;
  private readonly getCourseDetailUseCase: GetCourseDetailUseCase;

  constructor(repo: CourseRepositoryInterface) {
    super();

    this.getUserCoursesUseCase = new GetUserCoursesUseCase(repo);
    this.getCourseContentsUseCase = new GetCourseContentsUseCase(repo);
    this.getCourseDetailUseCase = new GetCourseDetailUseCase(repo);
  }

  getUserCourses(
    input: GetUserCoursesInput,
  ): Promise<Result<CourseListResponseDTO, Error>> {
    return this.execute(() => this.getUserCoursesUseCase.execute(input));
  }

  getCourseContents(
    input: GetCourseContentsInput,
  ): Promise<Result<CourseSectionResponseDTO[], Error>> {
    return this.execute(() => this.getCourseContentsUseCase.execute(input));
  }

  getCourseDetail(
    input: GetCourseDetailInput,
  ): Promise<Result<CourseDetailResponseDTO, Error>> {
    return this.execute(() => this.getCourseDetailUseCase.execute(input));
  }
}
