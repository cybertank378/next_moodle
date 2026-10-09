import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import type { AnswerInputPayload } from "@/modules/quiz/domain/dto/QuizAttemptRequestDto";
import type { SubmitQuizAttemptResponseDto } from "@/modules/quiz/domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "@/modules/quiz/domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "@/modules/quiz/domain/mapper/QuizAttemptMapper";
import { authorizeAttemptOperation } from "@/modules/quiz/application/services/QuizAttemptAuthorizationService";

export interface SubmitQuizAttemptInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  attemptId: number;
  quizId?: number;
  answers?: AnswerInputPayload;
  timeUp?: boolean;
}

export class SubmitQuizAttemptUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: SubmitQuizAttemptInput,
  ): Promise<SubmitQuizAttemptResponseDto> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_SUBMIT_OWN,
    );

    const attempt = await this.repository.getAttemptById(
      tenantId,
      input.studentMoodleToken,
      input.attemptId,
      input.quizId,
      input.actor.id,
    );

    if (!attempt) {
      throw new NotFoundError(
        `Attempt ujian dengan ID ${input.attemptId} tidak ditemukan.`,
      );
    }

    // Ownership check: must belong to the authenticated student actor
    attempt.assertAttemptOwnership(
      input.actor.id,
      input.actor.moodleUserId ?? undefined,
    );

    const payload = input.answers
      ? QuizAttemptMapper.toMoodleAnswerPayload(input.answers)
      : [];

    const result = await this.repository.processAttempt(
      tenantId,
      input.studentMoodleToken,
      input.attemptId,
      payload,
      true, // finishAttempt = true for final submission
      input.timeUp ?? false,
    );

    return {
      success: true,
      attemptId: input.attemptId,
      state: result.state,
      submittedAt: Date.now(),
    };
  }
}
