import { HttpStatus } from "@/core/constants/HttpStatus";
import { ApiResponse } from "@/core/http/ApiResponse";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type {
  GetAssignmentDetailUseCase,
  GetStudentAssignmentsUseCase,
  SubmitAssignmentUseCase,
} from "@/modules/assignment/application/usecases/AssignmentUseCases";

export class AssignmentController {
  constructor(
    private readonly getStudentAssignmentsUseCase: GetStudentAssignmentsUseCase,
    private readonly getAssignmentDetailUseCase: GetAssignmentDetailUseCase,
    private readonly submitAssignmentUseCase: SubmitAssignmentUseCase,
  ) {}

  async getStudentAssignments(options: {
    actor: AuthorizationActor;
    query?: {
      courseId?: number;
      status?: any;
      search?: string;
    };
    moodleToken?: string;
  }): Promise<Response> {
    const result = await this.getStudentAssignmentsUseCase.execute(options);

    if (result.isFailure) {
      const err = result.getError();
      return ApiResponse.error(err);
    }

    return ApiResponse.success(result.getValue());
  }

  async getAssignmentDetail(options: {
    actor: AuthorizationActor;
    assignmentId: string;
    moodleToken?: string;
  }): Promise<Response> {
    const result = await this.getAssignmentDetailUseCase.execute(options);

    if (result.isFailure) {
      const err = result.getError();
      return ApiResponse.error(err);
    }

    const data = result.getValue();
    if (!data) {
      return ApiResponse.error("Tugas tidak ditemukan.", HttpStatus.NOT_FOUND);
    }

    return ApiResponse.success(data);
  }

  async submitAssignment(options: {
    actor: AuthorizationActor;
    assignmentId: string;
    data: {
      onlineText?: string;
      fileIds?: string[];
    };
    moodleToken?: string;
  }): Promise<Response> {
    const result = await this.submitAssignmentUseCase.execute(options);

    if (result.isFailure) {
      const err = result.getError();
      return ApiResponse.error(err);
    }

    return ApiResponse.success(
      result.getValue(),
      undefined,
      HttpStatus.CREATED,
    );
  }
}
