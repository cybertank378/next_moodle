import { BaseEntity } from "@/core/base/BaseEntity";

export interface QuizProps {
  readonly id: string;
  readonly moodleQuizId: number;
  readonly courseId: string;
  readonly name: string;
  readonly intro: string;
  readonly timeLimitSeconds: number;
  readonly openTime: Date | null;
  readonly closeTime: Date | null;
  readonly attemptsAllowed: number;
}

export class Quiz extends BaseEntity<string> {
  public readonly moodleQuizId: number;
  public readonly courseId: string;
  public readonly name: string;
  public readonly intro: string;
  public readonly timeLimitSeconds: number;
  public readonly openTime: Date | null;
  public readonly closeTime: Date | null;
  public readonly attemptsAllowed: number;

  constructor(props: QuizProps) {
    super(props.id);
    this.moodleQuizId = props.moodleQuizId;
    this.courseId = props.courseId;
    this.name = props.name;
    this.intro = props.intro;
    this.timeLimitSeconds = props.timeLimitSeconds;
    this.openTime = props.openTime;
    this.closeTime = props.closeTime;
    this.attemptsAllowed = props.attemptsAllowed;
  }
}
