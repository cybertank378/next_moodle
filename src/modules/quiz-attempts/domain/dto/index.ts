import type { QuizAttemptState } from "../types/QuizAttemptState";

export interface QuizAttemptResponseDTO {
  readonly id: string;
  readonly moodleAttemptId: number;
  readonly quizId: string;
  readonly attemptNumber: number;
  readonly state: QuizAttemptState;
  readonly timeStart: string;
  readonly timeFinish: string | null;
}

export interface SaveQuizAnswerRequestDTO {
  readonly slot: number;
  readonly answerKey: string;
  readonly answerValue: string;
}

export interface AttemptSummaryResponseDTO {
  readonly attemptId: string;
  readonly state: QuizAttemptState;
  readonly totalQuestions: number;
  readonly answeredQuestions: number;
  readonly remainingSeconds: number;
}
