import type { TenantBrandingProps } from "./TenantBranding";
import type { TenantCredentialProps } from "./TenantCredential";

export type TenantDomainStatus = "ACTIVE" | "MAINTENANCE" | "SUSPENDED";

export interface TenantProps {
  id: string;
  slug: string;
  name: string;
  status: TenantDomainStatus;
  customDomain?: string | null;
  createdAt: Date;
  updatedAt: Date;
  credential?: TenantCredentialProps | null;
  branding?: TenantBrandingProps | null;
}

export class Tenant {
  constructor(private readonly props: TenantProps) {}

  get id(): string {
    return this.props.id;
  }

  get slug(): string {
    return this.props.slug;
  }

  get name(): string {
    return this.props.name;
  }

  get status(): TenantDomainStatus {
    return this.props.status;
  }

  get customDomain(): string | null | undefined {
    return this.props.customDomain;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get credential(): TenantCredentialProps | null | undefined {
    return this.props.credential;
  }

  get branding(): TenantBrandingProps | null | undefined {
    return this.props.branding;
  }

  get isActive(): boolean {
    return this.props.status === "ACTIVE";
  }

  get isSuspended(): boolean {
    return this.props.status === "SUSPENDED";
  }

  toJSON(): TenantProps {
    return { ...this.props };
  }
}
