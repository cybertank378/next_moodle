import type {
  CalendarEventProps,
  CalendarEventType,
} from "@/modules/calendar/domain/types/CalendarEventTypes";

export class CalendarEventEntity {
  constructor(
    public readonly id: string,
    public readonly tenantId: string,
    private readonly props: CalendarEventProps,
  ) {}

  get sourceType(): CalendarEventType {
    return this.props.sourceType;
  }

  get title(): string {
    return this.props.title;
  }

  get startAt(): string {
    return this.props.startAt;
  }

  get endAt(): string | null | undefined {
    return this.props.endAt;
  }

  get allDay(): boolean {
    return this.props.allDay;
  }

  get courseId(): number | undefined {
    return this.props.courseId;
  }

  get courseName(): string | undefined {
    return this.props.courseName;
  }

  get relatedResourceId(): string | number | undefined {
    return this.props.relatedResourceId;
  }

  get description(): string | undefined {
    return this.props.description;
  }

  get status(): string | undefined {
    return this.props.status;
  }

  get detailRoute(): string | undefined {
    return this.props.detailRoute;
  }

  get timezone(): string | undefined {
    return this.props.timezone;
  }

  toObject(): CalendarEventProps {
    return { ...this.props };
  }
}
