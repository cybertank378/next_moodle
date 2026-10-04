import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import type { QuizAttemptResponseDto } from "@/modules/quiz/domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "@/modules/quiz/domain/mapper/QuizAttemptMapper";
import { authorizeAttemptOperation } from "@/modules/quiz/application/services/QuizAttemptAuthorizationService";

export interface GetUserAttemptsInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  quizId: number;
  status?: "all" | "finished" | "unfinished";
}

export class GetUserAttemptsUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: GetUserAttemptsInput,
  ): Promise<QuizAttemptResponseDto[]> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_READ_OWN,
    );

    const attempts = await this.repository.getUserAttempts(
      tenantId,
      input.studentMoodleToken,
      input.quizId,
      input.actor.moodleUserId ?? undefined,
      input.status,
      input.actor.id,
    );

    return attempts.map((attempt) => QuizAttemptMapper.toDto(attempt));
  }
}
