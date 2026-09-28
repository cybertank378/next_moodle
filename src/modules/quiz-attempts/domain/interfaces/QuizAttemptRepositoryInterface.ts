import type {
  QuizAttemptDataResponseDto,
  QuizAttemptSummaryResponseDto,
} from "../dto/QuizAttemptResponseDto";
import type { QuizAttemptEntity } from "../entity/QuizAttemptEntity";
import type {
  MoodleAnswerPayloadItem,
  QuizAttemptStatus,
} from "../types/QuizAttemptTypes";

export interface QuizAttemptRepositoryInterface {
  startAttempt(
    tenantId: string,
    studentMoodleToken: string,
    quizId: number,
    forceNew?: boolean,
    userId?: string,
  ): Promise<QuizAttemptEntity>;

  getAttemptById(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    quizId?: number,
    userId?: string,
  ): Promise<QuizAttemptEntity | null>;

  getUserAttempts(
    tenantId: string,
    studentMoodleToken: string,
    quizId: number,
    moodleUserId?: number,
    status?: "all" | "finished" | "unfinished",
    userId?: string,
  ): Promise<QuizAttemptEntity[]>;

  getAttemptData(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    page: number,
    userId?: string,
  ): Promise<QuizAttemptDataResponseDto>;

  getAttemptSummary(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
  ): Promise<QuizAttemptSummaryResponseDto>;

  saveAttempt(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    data: MoodleAnswerPayloadItem[],
  ): Promise<boolean>;

  processAttempt(
    tenantId: string,
    studentMoodleToken: string,
    attemptId: number,
    data: MoodleAnswerPayloadItem[],
    finishAttempt?: boolean,
    timeUp?: boolean,
  ): Promise<{ state: QuizAttemptStatus }>;
}
