import { BaseEntity } from "@/core/base/BaseEntity";
import { AuthorizationError } from "@/core/rbac/AuthorizationError";
import type {
  QuizAttemptMetadata,
  QuizAttemptStatus,
} from "../types/QuizAttemptTypes";

export class QuizAttemptEntity extends BaseEntity<number> {
  private readonly _tenantId: string;
  private readonly _metadata: QuizAttemptMetadata;

  constructor(id: number, tenantId: string, metadata: QuizAttemptMetadata) {
    super(id);
    this._tenantId = tenantId;
    this._metadata = metadata;
  }

  public get tenantId(): string {
    return this._tenantId;
  }

  public get quizId(): number {
    return this._metadata.quizId;
  }

  public get userId(): string {
    return this._metadata.userId;
  }

  public get moodleUserId(): number {
    return this._metadata.moodleUserId;
  }

  public get attemptNumber(): number {
    return this._metadata.attemptNumber;
  }

  public get state(): QuizAttemptStatus {
    return this._metadata.state;
  }

  public get sumGrades(): number | null {
    return this._metadata.sumGrades ?? null;
  }

  public get timeStart(): number {
    return this._metadata.timeStart;
  }

  public get timeFinish(): number {
    return this._metadata.timeFinish;
  }

  public get timeModified(): number {
    return this._metadata.timeModified;
  }

  public get currentPage(): number {
    return this._metadata.currentPage;
  }

  public get metadata(): QuizAttemptMetadata {
    return this._metadata;
  }

  public isInProgress(): boolean {
    return this._metadata.state === "IN_PROGRESS";
  }

  public isFinished(): boolean {
    return this._metadata.state === "FINISHED";
  }

  /**
   * Asserts that the attempt is owned by the specified student actor.
   * Throws AuthorizationError if there is an ownership mismatch.
   */
  public assertAttemptOwnership(
    actorUserId: string,
    actorMoodleUserId?: number,
  ): void {
    const matchesUserId = this._metadata.userId === actorUserId;
    const matchesMoodleUserId =
      actorMoodleUserId !== undefined &&
      this._metadata.moodleUserId === actorMoodleUserId;

    if (!matchesUserId && !matchesMoodleUserId) {
      throw new AuthorizationError(
        "Akses ditolak: mahasiswa hanya dapat mengakses attempt miliknya sendiri.",
      );
    }
  }
}
