import { BaseEntity } from "@/core/base/BaseEntity";
import { QuestionType, QuestionOption } from "../types/QuestionTypes";

export interface QuestionProps {
  categoryId: number;
  type: QuestionType;
  name: string;
  questionText: string;
  defaultMark: number;
  options?: QuestionOption[];
  createdAt: Date;
  updatedAt: Date;
}

export class QuestionEntity extends BaseEntity<number> {
  private readonly _props: QuestionProps;

  constructor(id: number, props: QuestionProps) {
    super(id);
    this._props = props;
  }

  public get categoryId(): number {
    return this._props.categoryId;
  }
  public get type(): QuestionType {
    return this._props.type;
  }
  public get name(): string {
    return this._props.name;
  }
  public get questionText(): string {
    return this._props.questionText;
  }
  public get defaultMark(): number {
    return this._props.defaultMark;
  }
  public get options(): QuestionOption[] {
    return this._props.options ?? [];
  }
  public get createdAt(): Date {
    return this._props.createdAt;
  }
  public get updatedAt(): Date {
    return this._props.updatedAt;
  }
}
