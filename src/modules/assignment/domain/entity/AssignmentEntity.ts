import type {
  AssignmentFileDTO,
  AssignmentGradingStatus,
  AssignmentItemProps,
  AssignmentSubmissionStatus,
  AssignmentSubmissionType,
} from "@/modules/assignment/domain/types/AssignmentTypes";

export class AssignmentEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    private readonly props: AssignmentItemProps,
  ) {}

  get courseId(): number {
    return this.props.courseId;
  }

  get courseName(): string | undefined {
    return this.props.courseName;
  }

  get name(): string {
    return this.props.name;
  }

  get intro(): string | undefined {
    return this.props.intro;
  }

  get dueDate(): number | undefined {
    return this.props.dueDate;
  }

  get cutoffDate(): number | undefined {
    return this.props.cutoffDate;
  }

  get allowSubmissionsFromDate(): number | undefined {
    return this.props.allowSubmissionsFromDate;
  }

  get submissionType(): AssignmentSubmissionType {
    return this.props.submissionType;
  }

  get maxFilesAllowed(): number | undefined {
    return this.props.maxFilesAllowed;
  }

  get maxUploadBytes(): number | undefined {
    return this.props.maxUploadBytes;
  }

  get status(): AssignmentSubmissionStatus {
    return this.props.status;
  }

  get gradingStatus(): AssignmentGradingStatus {
    return this.props.gradingStatus;
  }

  get grade(): number | undefined {
    return this.props.grade;
  }

  get maxGrade(): number | undefined {
    return this.props.maxGrade;
  }

  get feedback(): string | undefined {
    return this.props.feedback;
  }

  get submittedAt(): string | undefined {
    return this.props.submittedAt;
  }

  get onlineText(): string | undefined {
    return this.props.onlineText;
  }

  get files(): AssignmentFileDTO[] {
    return this.props.files || [];
  }

  get isOverdue(): boolean {
    if (!this.props.dueDate) return false;
    return (
      Date.now() / 1000 > this.props.dueDate &&
      this.status !== "SUBMITTED" &&
      this.status !== "GRADED"
    );
  }

  get canSubmit(): boolean {
    if (this.props.canSubmit !== undefined) return this.props.canSubmit;
    const nowSec = Date.now() / 1000;
    if (
      this.props.allowSubmissionsFromDate &&
      nowSec < this.props.allowSubmissionsFromDate
    ) {
      return false;
    }
    if (this.props.cutoffDate && nowSec > this.props.cutoffDate) {
      return false;
    }
    return this.status !== "GRADED";
  }

  toJSON(): AssignmentItemProps {
    return {
      ...this.props,
      id: this.id,
      isOverdue: this.isOverdue,
      canSubmit: this.canSubmit,
    };
  }
}
