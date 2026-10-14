import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { AppRole } from "@/core/rbac/AppRole";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import type {
  GetAssignmentDetailUseCase,
  GetStudentAssignmentsUseCase,
  SubmitAssignmentUseCase,
} from "@/modules/assignment/application/usecases/AssignmentUseCases";
import { parseAssignmentQuery } from "@/modules/assignment/infrastructure/validators/assignmentValidator";

function actorToAuthorization(actor: CurrentActor): AuthorizationActor {
  return {
    id: actor.userId,
    role: actor.role as AppRole,
    tenantId: actor.tenantId || null,
    moodleUserId: actor.moodleUserId ?? undefined,
  };
}

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

export class AssignmentController {
  constructor(
    private readonly getStudentAssignmentsUseCase: GetStudentAssignmentsUseCase,
    private readonly getAssignmentDetailUseCase: GetAssignmentDetailUseCase,
    private readonly submitAssignmentUseCase: SubmitAssignmentUseCase,
  ) {}

  async getStudentAssignments(
    actor: CurrentActor,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const query = parseAssignmentQuery(req.nextUrl.searchParams);
      const result = await this.getStudentAssignmentsUseCase.execute({
        actor: actorToAuthorization(actor),
        query,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(ApiResponse.success(result.getValue()));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async getAssignmentDetail(
    actor: CurrentActor,
    assignmentId: string,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const result = await this.getAssignmentDetailUseCase.execute({
        actor: actorToAuthorization(actor),
        assignmentId,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      const data = result.getValue();
      if (!data) {
        return respond(
          ApiResponse.error(
            "NOT_FOUND",
            "Tugas tidak ditemukan.",
            HttpStatus.NOT_FOUND,
          ),
        );
      }

      return respond(ApiResponse.success(data));
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async submitAssignment(
    actor: CurrentActor,
    assignmentId: string,
    req: NextRequest,
    moodleToken?: string,
  ): Promise<NextResponse> {
    try {
      const body = await req.json().catch(() => ({}));
      const result = await this.submitAssignmentUseCase.execute({
        actor: actorToAuthorization(actor),
        assignmentId,
        data: body,
        moodleToken,
      });

      if (result.isFailure) {
        return respond(mapErrorToHttpResponse(result.getError()));
      }

      return respond(
        ApiResponse.success(result.getValue(), undefined, HttpStatus.CREATED),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
