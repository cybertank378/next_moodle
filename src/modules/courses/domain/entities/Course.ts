import { BaseEntity } from "@/core/base/BaseEntity";
import type { CourseVisibility } from "../types/CourseVisibility";

export interface CourseProps {
  readonly id: string;
  readonly moodleCourseId: number;
  readonly fullName: string;
  readonly shortName: string;
  readonly summary?: string;
  readonly categoryId?: number;
  readonly visibility: CourseVisibility;
  readonly enrolledUserCount?: number;
  readonly startDate?: Date;
  readonly endDate?: Date;
}

export class Course extends BaseEntity<string> {
  public readonly moodleCourseId: number;
  public readonly fullName: string;
  public readonly shortName: string;
  public readonly summary?: string;
  public readonly categoryId?: number;
  public readonly visibility: CourseVisibility;
  public readonly enrolledUserCount?: number;
  public readonly startDate?: Date;
  public readonly endDate?: Date;

  constructor(props: CourseProps) {
    super(props.id);
    this.moodleCourseId = props.moodleCourseId;
    this.fullName = props.fullName;
    this.shortName = props.shortName;
    this.summary = props.summary;
    this.categoryId = props.categoryId;
    this.visibility = props.visibility;
    this.enrolledUserCount = props.enrolledUserCount;
    this.startDate = props.startDate;
    this.endDate = props.endDate;
  }

  public isVisible(): boolean {
    return this.visibility === "visible";
  }
}
