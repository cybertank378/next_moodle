import { BaseEntity } from "@/core/base/BaseEntity";
import { TenantRules } from "@/modules/tenant/domain/rules/TenantRules";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantStatus";

export interface TenantProps {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly status: TenantStatus;
  readonly moodleBaseUrl: string;
  readonly moodleServiceShortname?: string | null;
  readonly createdAt?: Date;
  readonly updatedAt?: Date;
}

export class Tenant extends BaseEntity<string> {
  public readonly slug: string;
  public readonly name: string;
  public readonly status: TenantStatus;
  public readonly moodleBaseUrl: string;
  public readonly moodleServiceShortname: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(props: TenantProps) {
    super(props.id);
    this.slug = props.slug;
    this.name = props.name;
    this.status = props.status;
    this.moodleBaseUrl = props.moodleBaseUrl.replace(/\/+$/, "");
    this.moodleServiceShortname = props.moodleServiceShortname ?? null;
    this.createdAt = props.createdAt ?? new Date();
    this.updatedAt = props.updatedAt ?? new Date();
  }

  public isActive(): boolean {
    return this.status === "ACTIVE";
  }

  public isSuspended(): boolean {
    return this.status === "SUSPENDED";
  }

  public canAccess(): boolean {
    return TenantRules.canAccess(this.status);
  }
}
