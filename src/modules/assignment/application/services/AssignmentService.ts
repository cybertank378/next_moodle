import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import {
  GetAssignmentDetailUseCase,
  GetStudentAssignmentsUseCase,
  SubmitAssignmentUseCase,
} from "@/modules/assignment/application/usecases/AssignmentUseCases";
import type {
  GetAssignmentDetailInput,
  GetStudentAssignmentsInput,
  SubmitAssignmentInput,
} from "@/modules/assignment/domain/dto/AssignmentRequestDTO";
import type {
  AssignmentItemDTO,
  AssignmentListResponseDTO,
} from "@/modules/assignment/domain/dto/AssignmentResponseDTO";
import type { AssignmentRepositoryInterface } from "@/modules/assignment/domain/interfaces/AssignmentRepositoryInterface";

/* ============================================================
 * ASSIGNMENT SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Assignment Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class AssignmentService extends BaseService {
  private readonly getStudentAssignmentsUseCase: GetStudentAssignmentsUseCase;
  private readonly getAssignmentDetailUseCase: GetAssignmentDetailUseCase;
  private readonly submitAssignmentUseCase: SubmitAssignmentUseCase;

  constructor(
    repo: AssignmentRepositoryInterface,
    clientFactory: MoodleClientFactory,
  ) {
    super();

    this.getStudentAssignmentsUseCase = new GetStudentAssignmentsUseCase(
      repo,
      clientFactory,
    );
    this.getAssignmentDetailUseCase = new GetAssignmentDetailUseCase(
      repo,
      clientFactory,
    );
    this.submitAssignmentUseCase = new SubmitAssignmentUseCase();
  }

  getStudentAssignments(
    input: GetStudentAssignmentsInput,
  ): Promise<Result<AssignmentListResponseDTO, Error>> {
    return this.execute(() => this.getStudentAssignmentsUseCase.execute(input));
  }

  getAssignmentDetail(
    input: GetAssignmentDetailInput,
  ): Promise<Result<AssignmentItemDTO | null, Error>> {
    return this.execute(() => this.getAssignmentDetailUseCase.execute(input));
  }

  submitAssignment(
    input: SubmitAssignmentInput,
  ): Promise<Result<AssignmentItemDTO, Error>> {
    return this.execute(() => this.submitAssignmentUseCase.execute(input));
  }
}
