import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
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
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";

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

  async getStudentAssignments(req: NextRequest): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const query = parseAssignmentQuery(req.nextUrl.searchParams);
      const result = await this.getStudentAssignmentsUseCase.execute({
        actor: actorToAuthorization(session.actor),
        query,
        moodleToken: session.moodleToken,
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
    _req: NextRequest,
    assignmentId: string,
  ): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const result = await this.getAssignmentDetailUseCase.execute({
        actor: actorToAuthorization(session.actor),
        assignmentId,
        moodleToken: session.moodleToken,
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
    req: NextRequest,
    assignmentId: string,
  ): Promise<NextResponse> {
    try {
      const session = await getCurrentSession();
      if (!session) {
        throw new UnauthorizedError("Sesi tidak valid.");
      }
      const body = await req.json().catch(() => ({}));
      const result = await this.submitAssignmentUseCase.execute({
        actor: actorToAuthorization(session.actor),
        assignmentId,
        data: body,
        moodleToken: session.moodleToken,
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
