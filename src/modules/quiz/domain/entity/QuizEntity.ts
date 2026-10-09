import { BaseEntity } from "@/core/base/BaseEntity";
import type {
  QuizAccessRuleEvaluation,
  QuizAccessStatus,
  QuizMetadata,
} from "@/modules/quiz/domain/types/QuizTypes";

export class QuizEntity extends BaseEntity<number> {
  private readonly _tenantId: string;
  private readonly _metadata: QuizMetadata;

  constructor(id: number, tenantId: string, metadata: QuizMetadata) {
    super(id);
    this._tenantId = tenantId;
    this._metadata = metadata;
  }

  public get tenantId(): string {
    return this._tenantId;
  }

  public get courseId(): number {
    return this._metadata.courseId;
  }

  public get courseModuleId(): number {
    return this._metadata.courseModuleId;
  }

  public get name(): string {
    return this._metadata.name;
  }

  public get intro(): string {
    return this._metadata.intro ?? "";
  }

  public get timeOpen(): number {
    return this._metadata.timeOpen;
  }

  public get timeClose(): number {
    return this._metadata.timeClose;
  }

  public get timeLimitSeconds(): number {
    return this._metadata.timeLimitSeconds;
  }

  public get maxAttempts(): number {
    return this._metadata.maxAttempts;
  }

  public get grade(): number | null {
    return this._metadata.grade ?? null;
  }

  public get isVisible(): boolean {
    return this._metadata.isVisible;
  }

  public get metadata(): QuizMetadata {
    return this._metadata;
  }

  public getStatus(currentTime?: number): QuizAccessStatus {
    const now = currentTime ?? Math.floor(Date.now() / 1000);

    if (this.timeClose > 0 && now > this.timeClose) {
      return "CLOSED";
    }

    if (this.timeOpen > 0 && now < this.timeOpen) {
      return "UPCOMING";
    }

    return "OPEN";
  }

  public evaluateAccess(currentTime?: number): QuizAccessRuleEvaluation {
    const now = currentTime ?? Math.floor(Date.now() / 1000);
    const status = this.getStatus(now);

    if (status === "CLOSED") {
      return {
        isAllowed: false,
        status: "CLOSED",
        reasons: ["Waktu ujian telah berakhir atau kuis telah ditutup."],
      };
    }

    if (status === "UPCOMING") {
      return {
        isAllowed: false,
        status: "UPCOMING",
        reasons: ["Ujian belum dibuka untuk peserta."],
      };
    }

    return {
      isAllowed: true,
      status: "OPEN",
      reasons: [],
    };
  }
}
