import { NotFoundError } from "@/core/errors/NotFoundError";
import type { AuthorizationActor } from "@/core/rbac/AuthorizationContext";
import { Permission } from "@/core/rbac/Permission";
import type { AnswerInputPayload } from "../../domain/dto/QuizAttemptRequestDto";
import type { SaveQuizAnswerResponseDto } from "../../domain/dto/QuizAttemptResponseDto";
import type { QuizAttemptRepositoryInterface } from "../../domain/interfaces/QuizAttemptRepositoryInterface";
import { QuizAttemptMapper } from "../../domain/mapper/QuizAttemptMapper";
import { authorizeAttemptOperation } from "../services/QuizAttemptAuthorizationService";

export interface SaveQuizAnswerInput {
  actor: AuthorizationActor;
  studentMoodleToken: string;
  attemptId: number;
  quizId?: number;
  answers: AnswerInputPayload;
}

export class SaveQuizAnswerUseCase {
  constructor(private readonly repository: QuizAttemptRepositoryInterface) {}

  public async execute(
    input: SaveQuizAnswerInput,
  ): Promise<SaveQuizAnswerResponseDto> {
    const tenantId = authorizeAttemptOperation(
      input.actor,
      Permission.ATTEMPT_SAVE_OWN,
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

    const payload = QuizAttemptMapper.toMoodleAnswerPayload(input.answers);
    const success = await this.repository.saveAttempt(
      tenantId,
      input.studentMoodleToken,
      input.attemptId,
      payload,
    );

    return {
      success,
      attemptId: input.attemptId,
      savedAt: Date.now(),
    };
  }
}
