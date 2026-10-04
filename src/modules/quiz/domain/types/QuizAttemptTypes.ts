export type QuizAttemptStatus = "IN_PROGRESS" | "FINISHED" | "ABANDONED";

export interface RawMoodleAttempt {
  id: number;
  quiz: number;
  userid: number;
  attempt: number;
  sumgrades?: number | null;
  timestart: number;
  timefinish: number;
  timemodified: number;
  timemodifiedoffline?: number;
  timecheckstate?: number | null;
  state: string;
  currentpage?: number;
}

export interface RawMoodleAttemptQuestion {
  slot: number;
  type?: string;
  page?: number;
  html?: string;
  sequencecheck?: number;
  lastactiontime?: number;
  hasautosaved?: boolean;
  flagged?: boolean;
  number?: number;
  state?: string;
  status?: string;
  blockedbyprevious?: boolean;
  maxmark?: number;
  mark?: string | number | null;
}

export interface RawMoodleAttemptData {
  attempt: RawMoodleAttempt;
  questions: RawMoodleAttemptQuestion[];
  nextpage: number;
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode?: string;
    message?: string;
  }>;
}

export interface RawMoodleAttemptSummary {
  questions: RawMoodleAttemptQuestion[];
  warnings?: Array<{
    item?: string;
    itemid?: number;
    warningcode?: string;
    message?: string;
  }>;
}

export interface MoodleAnswerPayloadItem {
  name: string;
  value: string;
}

export interface StructuredQuestionAnswer {
  slot: number;
  answer: string;
  sequenceCheck?: number;
}

export interface QuizAttemptMetadata {
  readonly id: number;
  readonly quizId: number;
  readonly userId: string;
  readonly moodleUserId: number;
  readonly attemptNumber: number;
  readonly state: QuizAttemptStatus;
  readonly sumGrades?: number | null;
  readonly timeStart: number;
  readonly timeFinish: number;
  readonly timeModified: number;
  readonly currentPage: number;
}
