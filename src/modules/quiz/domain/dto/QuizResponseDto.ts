import type { QuizAccessStatus } from "../types/QuizTypes";

export interface QuizSummaryResponseDTO {
  id: number;
  courseId: number;
  courseModuleId: number;
  name: string;
  intro: string;
  timeOpen: number;
  timeClose: number;
  timeLimitSeconds: number;
  maxAttempts: number;
  grade: number | null;
  isVisible: boolean;
  status: QuizAccessStatus;
}

export interface QuizAccessResponseDTO {
  quizId: number;
  canAttempt: boolean;
  status: QuizAccessStatus;
  reasons: string[];
  timeOpen: number;
  timeClose: number;
  timeLimitSeconds: number;
}

export interface QuizListResponseDTO {
  quizzes: QuizSummaryResponseDTO[];
  total: number;
}
