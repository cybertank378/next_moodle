import { BaseEntity } from "@/core/base/BaseEntity";
import type { QuizAttemptState } from "@/modules/quiz-attempts/domain/types/QuizAttemptState";

export interface QuizAttemptProps {
  readonly id: string;
  readonly moodleAttemptId: number;
  readonly quizId: string;
  readonly actorId: string;
  readonly attemptNumber: number;
  readonly state: QuizAttemptState;
  readonly timeStart: Date;
  readonly timeFinish: Date | null;
  readonly timeModified: Date;
}

export class QuizAttempt extends BaseEntity<string> {
  public readonly moodleAttemptId: number;
  public readonly quizId: string;
  public readonly actorId: string;
  public readonly attemptNumber: number;
  public readonly state: QuizAttemptState;
  public readonly timeStart: Date;
  public readonly timeFinish: Date | null;
  public readonly timeModified: Date;

  constructor(props: QuizAttemptProps) {
    super(props.id);
    this.moodleAttemptId = props.moodleAttemptId;
    this.quizId = props.quizId;
    this.actorId = props.actorId;
    this.attemptNumber = props.attemptNumber;
    this.state = props.state;
    this.timeStart = props.timeStart;
    this.timeFinish = props.timeFinish;
    this.timeModified = props.timeModified;
  }

  public isInProgress(): boolean {
    return this.state === "inprogress";
  }
}
