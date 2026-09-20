import type {
  AttemptSummaryResponseDTO,
  SaveQuizAnswerRequestDTO,
} from "@/modules/quiz-attempts/domain/dto";
import type { QuizAttempt } from "@/modules/quiz-attempts/domain/entities/QuizAttempt";

export interface QuizAttemptRepository {
  getAttemptById(
    attemptId: string,
    tenantId: string,
  ): Promise<QuizAttempt | null>;
  startAttempt(
    quizId: string,
    actorId: string,
    tenantId: string,
  ): Promise<QuizAttempt>;
  saveAnswer(
    attemptId: string,
    answer: SaveQuizAnswerRequestDTO,
    tenantId: string,
  ): Promise<void>;
  getAttemptSummary(
    attemptId: string,
    tenantId: string,
  ): Promise<AttemptSummaryResponseDTO>;
  submitAttempt(
    attemptId: string,
    finishTime: Date,
    tenantId: string,
  ): Promise<void>;
}
