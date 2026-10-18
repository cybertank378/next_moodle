import { BaseService } from "@/core/base/BaseService";
import type { Result } from "@/core/base/Result";
import {
  EnrolUsersUseCase,
  type EnrolUsersInput,
} from "@/modules/enrolment/application/usecases/EnrolUsersUseCase";
import {
  ListEnrolmentsUseCase,
  type ListEnrolmentsInput,
} from "@/modules/enrolment/application/usecases/ListEnrolmentsUseCase";
import {
  UnenrolUsersUseCase,
  type UnenrolUsersInput,
} from "@/modules/enrolment/application/usecases/UnenrolUsersUseCase";
import type { EnrolmentListResponseDto } from "@/modules/enrolment/domain/dto/EnrolmentResponseDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

/* ============================================================
 * ENROLMENT SERVICE
 * ============================================================
 *
 * Responsibility:
 * - Application Facade
 * - UseCase Orchestrator
 * - Transaction Boundary
 * - Enrolment Workflow Coordinator
 * - Thin Application Entry Point
 *
 * NOT:
 * - Business Logic Layer
 * - Repository Wrapper
 * - Database Layer
 * ============================================================
 */

export class EnrolmentService extends BaseService {
  private readonly enrolUsersUseCase: EnrolUsersUseCase;
  private readonly listEnrolmentsUseCase: ListEnrolmentsUseCase;
  private readonly unenrolUsersUseCase: UnenrolUsersUseCase;

  constructor(repo: EnrolmentRepositoryInterface) {
    super();

    this.enrolUsersUseCase = new EnrolUsersUseCase(repo);
    this.listEnrolmentsUseCase = new ListEnrolmentsUseCase(repo);
    this.unenrolUsersUseCase = new UnenrolUsersUseCase(repo);
  }

  enrolUsers(input: EnrolUsersInput): Promise<Result<boolean, Error>> {
    return this.execute(() => this.enrolUsersUseCase.execute(input));
  }

  listEnrolments(
    input: ListEnrolmentsInput,
  ): Promise<Result<EnrolmentListResponseDto, Error>> {
    return this.execute(() => this.listEnrolmentsUseCase.execute(input));
  }

  unenrolUsers(input: UnenrolUsersInput): Promise<Result<boolean, Error>> {
    return this.execute(() => this.unenrolUsersUseCase.execute(input));
  }
}
