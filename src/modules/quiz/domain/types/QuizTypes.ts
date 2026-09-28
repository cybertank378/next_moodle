export type QuizAccessStatus = "OPEN" | "UPCOMING" | "CLOSED";

export interface RawMoodleQuiz {
  id: number;
  course: number;
  coursemodule: number;
  name: string;
  intro?: string;
  introformat?: number;
  timeopen: number;
  timeclose: number;
  timelimit: number;
  attempts: number;
  grademethod?: number;
  sumgrades?: number;
  grade?: number;
  preferredbehaviour?: string;
  hasfeedback?: number;
  section?: number;
  visible?: number;
}

export interface RawMoodleQuizAccessInfo {
  canattempt?: boolean;
  preventaccessreasons?: string[];
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode?: string;
    message?: string;
  }>;
}

export interface QuizMetadata {
  readonly id: number;
  readonly courseId: number;
  readonly courseModuleId: number;
  readonly name: string;
  readonly intro?: string;
  readonly timeOpen: number;
  readonly timeClose: number;
  readonly timeLimitSeconds: number;
  readonly maxAttempts: number;
  readonly grade?: number;
  readonly isVisible: boolean;
}

export interface QuizAccessRuleEvaluation {
  readonly isAllowed: boolean;
  readonly status: QuizAccessStatus;
  readonly reasons: readonly string[];
  readonly timeRemainingSeconds?: number;
}
