import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import {
  GetScheduleSessionDetailUseCase,
} from "@/modules/schedule/application/usecases/GetScheduleSessionDetailUseCase";
import {
  GetStudentScheduleUseCase,
} from "@/modules/schedule/application/usecases/GetStudentScheduleUseCase";
import {
  GetTeacherSchedulesUseCase,
} from "@/modules/schedule/application/usecases/GetTeacherSchedulesUseCase";
import {
  GetTenantSchedulesUseCase,
} from "@/modules/schedule/application/usecases/GetTenantSchedulesUseCase";
import {
  CancelScheduleUseCase,
  CreateScheduleUseCase,
  PublishScheduleUseCase,
  UpdateScheduleUseCase,
} from "@/modules/schedule/application/usecases/MutateScheduleUseCases";
import type {
  CancelScheduleInput,
  CreateScheduleInput,
  GetScheduleSessionDetailInput,
  GetStudentScheduleInput,
  GetTeacherSchedulesInput,
  GetTenantSchedulesInput,
  PublishScheduleInput,
  UpdateScheduleInput,
} from "@/modules/schedule/domain/dto/ScheduleRequestDTO";
import type {
  ScheduleResponseDTO,
  ScheduleSessionItemDTO,
} from "@/modules/schedule/domain/dto/ScheduleResponseDTO";
import type { ScheduleRepositoryInterface } from "@/modules/schedule/domain/interfaces/ScheduleRepositoryInterface";

/* ============================================================
 * SCHEDULE SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Schedule Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class ScheduleService extends BaseService {
  private readonly getScheduleSessionDetailUseCase: GetScheduleSessionDetailUseCase;
  private readonly getStudentScheduleUseCase: GetStudentScheduleUseCase;
  private readonly getTeacherSchedulesUseCase: GetTeacherSchedulesUseCase;
  private readonly getTenantSchedulesUseCase: GetTenantSchedulesUseCase;
  private readonly createScheduleUseCase: CreateScheduleUseCase;
  private readonly updateScheduleUseCase: UpdateScheduleUseCase;
  private readonly publishScheduleUseCase: PublishScheduleUseCase;
  private readonly cancelScheduleUseCase: CancelScheduleUseCase;

  constructor(
    repo: ScheduleRepositoryInterface,
    clientFactory: MoodleClientFactory,
  ) {
    super();

    this.getScheduleSessionDetailUseCase = new GetScheduleSessionDetailUseCase(
      repo,
      clientFactory,
    );
    this.getStudentScheduleUseCase = new GetStudentScheduleUseCase(
      repo,
      clientFactory,
    );
    this.getTeacherSchedulesUseCase = new GetTeacherSchedulesUseCase(
      repo,
      clientFactory,
    );
    this.getTenantSchedulesUseCase = new GetTenantSchedulesUseCase(
      repo,
      clientFactory,
    );
    this.createScheduleUseCase = new CreateScheduleUseCase(repo);
    this.updateScheduleUseCase = new UpdateScheduleUseCase(repo);
    this.publishScheduleUseCase = new PublishScheduleUseCase(repo);
    this.cancelScheduleUseCase = new CancelScheduleUseCase(repo);
  }

  getSessionDetail(
    input: GetScheduleSessionDetailInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    return this.execute(() =>
      this.getScheduleSessionDetailUseCase.execute(input),
    );
  }

  getStudentSchedule(
    input: GetStudentScheduleInput,
  ): Promise<Result<ScheduleResponseDTO, Error>> {
    return this.execute(() => this.getStudentScheduleUseCase.execute(input));
  }

  getTeacherSchedules(
    input: GetTeacherSchedulesInput,
  ): Promise<Result<ScheduleResponseDTO, Error>> {
    return this.execute(() => this.getTeacherSchedulesUseCase.execute(input));
  }

  getTenantSchedules(
    input: GetTenantSchedulesInput,
  ): Promise<Result<ScheduleResponseDTO, Error>> {
    return this.execute(() => this.getTenantSchedulesUseCase.execute(input));
  }

  createSchedule(
    input: CreateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    return this.execute(() => this.createScheduleUseCase.execute(input));
  }

  updateSchedule(
    input: UpdateScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    return this.execute(() => this.updateScheduleUseCase.execute(input));
  }

  publishSchedule(
    input: PublishScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    return this.execute(() => this.publishScheduleUseCase.execute(input));
  }

  cancelSchedule(
    input: CancelScheduleInput,
  ): Promise<Result<ScheduleSessionItemDTO, Error>> {
    return this.execute(() => this.cancelScheduleUseCase.execute(input));
  }
}
