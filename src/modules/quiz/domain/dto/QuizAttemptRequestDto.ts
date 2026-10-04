import type {
  MoodleAnswerPayloadItem,
  StructuredQuestionAnswer,
} from "@/modules/quiz/domain/types/QuizAttemptTypes";

export type AnswerInputPayload =
  | Record<string, string | number>
  | StructuredQuestionAnswer[]
  | MoodleAnswerPayloadItem[];

export interface StartQuizAttemptRequestDto {
  quizId: number;
  forceNew?: boolean;
}

export interface SaveQuizAnswerRequestDto {
  attemptId: number;
  answers: AnswerInputPayload;
}

export interface SubmitQuizAttemptRequestDto {
  attemptId: number;
  answers?: AnswerInputPayload;
  timeUp?: boolean;
}

export interface GetUserAttemptsRequestDto {
  quizId: number;
  status?: "all" | "finished" | "unfinished";
}

export interface GetAttemptDataRequestDto {
  attemptId: number;
  page: number;
}

export interface GetAttemptSummaryRequestDto {
  attemptId: number;
}
