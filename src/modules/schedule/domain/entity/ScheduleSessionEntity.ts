import type {
  ScheduleSessionProps,
  ScheduleSessionStatus,
  ScheduleSessionType,
} from "@/modules/schedule/domain/types/ScheduleTypes";

export class ScheduleSessionEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    private readonly props: ScheduleSessionProps,
  ) {}

  get sessionType(): ScheduleSessionType {
    return this.props.sessionType;
  }

  get title(): string {
    return this.props.title;
  }

  get startsAt(): string {
    return this.props.startsAt;
  }

  get endsAt(): string {
    return this.props.endsAt;
  }

  get allDay(): boolean {
    return Boolean(this.props.allDay);
  }

  get courseId(): number | undefined {
    return this.props.courseId;
  }

  get courseName(): string | undefined {
    return this.props.courseName;
  }

  get subjectCode(): string | undefined {
    return this.props.subjectCode;
  }

  get room(): string | undefined {
    return this.props.room;
  }

  get instructor(): string | undefined {
    return this.props.instructor;
  }

  get classGroup(): string | undefined {
    return this.props.classGroup;
  }

  get status(): ScheduleSessionStatus {
    return this.props.status;
  }

  get detailRoute(): string | undefined {
    return this.props.detailRoute;
  }

  get timezone(): string | undefined {
    return this.props.timezone;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get sourceUpdatedAt(): string | undefined {
    return this.props.sourceUpdatedAt;
  }

  get isPublished(): boolean {
    return (
      this.props.isPublished ??
      (this.props.status !== "DRAFT" && this.props.status !== "ARCHIVED")
    );
  }

  toObject(): ScheduleSessionProps {
    return { ...this.props };
  }
}
