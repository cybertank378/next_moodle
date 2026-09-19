import type { QuizAvailability } from "../types/QuizAvailability";

export interface QuizResponseDTO {
  readonly id: string;
  readonly moodleQuizId: number;
  readonly courseId: string;
  readonly name: string;
  readonly intro: string;
  readonly timeLimitSeconds: number;
  readonly openTime: string | null;
  readonly closeTime: string | null;
  readonly attemptsAllowed: number;
}

export interface QuizAccessResponseDTO {
  readonly quizId: string;
  readonly availability: QuizAvailability;
  readonly canAttempt: boolean;
  readonly preventReasons: readonly string[];
  readonly accessRules: readonly string[];
}
