export interface GradeItemProps {
  id: number;
  itemName: string;
  itemType: string;
  itemModule: string | null;
  itemInstance: number | null;
  gradeRaw: number | null;
  gradeFormatted: string;
  gradeMin: number;
  gradeMax: number;
  gradePass: number | null;
  percentageFormatted: string | null;
  feedback: string | null;
}

export class GradeItemEntity {
  private readonly _props: GradeItemProps;

  constructor(props: GradeItemProps) {
    this._props = { ...props };
  }

  public get id(): number {
    return this._props.id;
  }

  public get itemName(): string {
    return this._props.itemName;
  }

  public get itemType(): string {
    return this._props.itemType;
  }

  public get itemModule(): string | null {
    return this._props.itemModule;
  }

  public get itemInstance(): number | null {
    return this._props.itemInstance;
  }

  public get gradeRaw(): number | null {
    return this._props.gradeRaw;
  }

  public get gradeFormatted(): string {
    return this._props.gradeFormatted;
  }

  public get gradeMin(): number {
    return this._props.gradeMin;
  }

  public get gradeMax(): number {
    return this._props.gradeMax;
  }

  public get gradePass(): number | null {
    return this._props.gradePass;
  }

  public get percentageFormatted(): string | null {
    return this._props.percentageFormatted;
  }

  public get feedback(): string | null {
    return this._props.feedback;
  }

  public get isPassed(): boolean | null {
    if (this._props.gradeRaw === null || this._props.gradePass === null) {
      return null;
    }
    return this._props.gradeRaw >= this._props.gradePass;
  }

  public isCourseTotal(): boolean {
    return this._props.itemType === "course";
  }

  public toJSON(): GradeItemProps & { isPassed: boolean | null } {
    return {
      ...this._props,
      isPassed: this.isPassed,
    };
  }
}

export interface UserGradeReportProps {
  courseId: number;
  userId: number;
  userFullName: string;
  items: GradeItemEntity[];
  courseTotal: GradeItemEntity | null;
}

export class UserGradeReportEntity {
  private readonly _props: UserGradeReportProps;

  constructor(props: UserGradeReportProps) {
    this._props = {
      ...props,
      items: [...props.items],
    };
  }

  public get courseId(): number {
    return this._props.courseId;
  }

  public get userId(): number {
    return this._props.userId;
  }

  public get userFullName(): string {
    return this._props.userFullName;
  }

  public get items(): GradeItemEntity[] {
    return [...this._props.items];
  }

  public get courseTotal(): GradeItemEntity | null {
    return this._props.courseTotal;
  }

  public get passedItemsCount(): number {
    return this._props.items.filter((item) => item.isPassed === true).length;
  }

  public get totalAssessedItems(): number {
    return this._props.items.filter((item) => item.gradeRaw !== null).length;
  }
}
