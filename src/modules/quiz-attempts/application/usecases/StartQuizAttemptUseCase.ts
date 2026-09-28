import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import type { QuizAttemptResponseDto } from "../../domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "../../domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "../../domain/mapper/QuizAttemptMapper";
import { authorizeAttemptOperation } from "../services/QuizAttemptAuthorizationService";

export interface StartQuizAttemptInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  quizId: number;
  forceNew?: boolean;
}

export class StartQuizAttemptUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: StartQuizAttemptInput,
  ): Promise<QuizAttemptResponseDto> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_START,
    );

    const attempt = await this.repository.startAttempt(
      tenantId,
      input.studentMoodleToken,
      input.quizId,
      input.forceNew,
      input.actor.id,
    );

    return QuizAttemptMapper.toDto(attempt);
  }
}
