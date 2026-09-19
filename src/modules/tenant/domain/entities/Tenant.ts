import { BaseEntity } from "@/core/base/BaseEntity";
import type { TenantStatus } from "../types/TenantStatus";

export interface TenantProps {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly moodleUrl: string;
  readonly moodleToken: string;
  readonly status: TenantStatus;
  readonly createdAt: Date;
}

export class Tenant extends BaseEntity<string> {
  public readonly slug: string;
  public readonly name: string;
  public readonly moodleUrl: string;
  public readonly moodleToken: string;
  public readonly status: TenantStatus;
  public readonly createdAt: Date;

  constructor(props: TenantProps) {
    super(props.id);
    this.slug = props.slug;
    this.name = props.name;
    this.moodleUrl = props.moodleUrl;
    this.moodleToken = props.moodleToken;
    this.status = props.status;
    this.createdAt = props.createdAt;
  }

  public isActive(): boolean {
    return this.status === "active";
  }
}
