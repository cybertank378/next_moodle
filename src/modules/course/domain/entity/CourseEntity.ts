import { BaseEntity } from "@/core/base/BaseEntity";
import type { CourseMetadata } from "@/modules/course/domain/types/CourseTypes";

export class CourseEntity extends BaseEntity<number> {
  private readonly _tenantId: string;
  private readonly _metadata: CourseMetadata;

  constructor(id: number, tenantId: string, metadata: CourseMetadata) {
    super(id);
    this._tenantId = tenantId;
    this._metadata = metadata;
  }

  public get tenantId(): string {
    return this._tenantId;
  }

  public get shortName(): string {
    return this._metadata.shortName;
  }

  public get fullName(): string {
    return this._metadata.fullName;
  }

  public get displayName(): string {
    return this._metadata.displayName || this._metadata.fullName;
  }

  public get idNumber(): string | null {
    return this._metadata.idNumber ?? null;
  }

  public get summary(): string {
    return this._metadata.summary ?? "";
  }

  public get format(): string {
    return this._metadata.format ?? "topics";
  }

  public get startDate(): number | null {
    return this._metadata.startDate ?? null;
  }

  public get endDate(): number | null {
    return this._metadata.endDate ?? null;
  }

  public get categoryId(): number | null {
    return this._metadata.categoryId ?? null;
  }

  public get progress(): number | null {
    return this._metadata.progress ?? null;
  }

  public get isCompleted(): boolean {
    return Boolean(this._metadata.isCompleted);
  }

  public get imageUrl(): string | null {
    return this._metadata.imageUrl ?? null;
  }

  public get metadata(): CourseMetadata {
    return this._metadata;
  }
}
