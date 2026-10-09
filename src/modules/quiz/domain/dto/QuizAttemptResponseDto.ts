import type { QuizAttemptStatus } from "@/modules/quiz/domain/types/QuizAttemptTypes";

export interface QuizAttemptResponseDto {
  id: number;
  quizId: number;
  userId: string;
  moodleUserId: number;
  attemptNumber: number;
  state: QuizAttemptStatus;
  sumGrades: number | null;
  timeStart: number;
  timeFinish: number;
  timeModified: number;
  currentPage: number;
}

export interface QuizAttemptQuestionDto {
  slot: number;
  type?: string;
  page?: number;
  html?: string;
  sequenceCheck?: number;
  lastActionTime?: number;
  hasAutoSaved?: boolean;
  flagged?: boolean;
  number?: number;
  state?: string;
  status?: string;
  maxMark?: number;
  mark?: number | null;
}

export interface QuizAttemptDataResponseDto {
  attempt: QuizAttemptResponseDto;
  questions: QuizAttemptQuestionDto[];
  nextPage: number;
}

export interface QuizAttemptSummaryResponseDto {
  questions: QuizAttemptQuestionDto[];
}

export interface SaveQuizAnswerResponseDto {
  success: boolean;
  attemptId: number;
  savedAt: number;
}

export interface SubmitQuizAttemptResponseDto {
  success: boolean;
  attemptId: number;
  state: QuizAttemptStatus;
  submittedAt: number;
}
