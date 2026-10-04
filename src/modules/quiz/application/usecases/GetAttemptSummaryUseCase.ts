import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import type { QuizAttemptSummaryResponseDto } from "../../domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "../../domain/interfaces/QuizAttemptRepositoryInterface";
import { authorizeAttemptOperation } from "../services/QuizAttemptAuthorizationService";

export interface GetAttemptSummaryInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  attemptId: number;
}

export class GetAttemptSummaryUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: GetAttemptSummaryInput,
  ): Promise<QuizAttemptSummaryResponseDto> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_READ_OWN,
    );

    return this.repository.getAttemptSummary(
      tenantId,
      input.studentMoodleToken,
      input.attemptId,
    );
  }
}
