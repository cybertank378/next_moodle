import type {
  TenantBrandingMetadata,
  TenantCredentialMetadata,
  TenantStatus,
} from "@/modules/tenants/domain/types/TenantTypes";

export interface TenantProps {
  id: string;
  slug: string;
  name: string;
  status: TenantStatus;
  customDomain: string | null;
  credential: TenantCredentialMetadata | null;
  branding: TenantBrandingMetadata | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Tenant {
  constructor(private readonly props: TenantProps) {}

  get id() {
    return this.props.id;
  }
  get slug() {
    return this.props.slug;
  }
  get name() {
    return this.props.name;
  }
  get status() {
    return this.props.status;
  }
  get customDomain() {
    return this.props.customDomain;
  }
  get credential() {
    return this.props.credential;
  }
  get branding() {
    return this.props.branding;
  }
  get createdAt() {
    return this.props.createdAt;
  }
  get updatedAt() {
    return this.props.updatedAt;
  }

  withUpdate(input: { name?: string; customDomain?: string | null }): Tenant {
    return new Tenant({
      ...this.props,
      name: input.name ?? this.name,
      customDomain:
        input.customDomain !== undefined
          ? input.customDomain
          : this.customDomain,
      updatedAt: new Date(),
    });
  }

  withStatus(status: TenantStatus): Tenant {
    return new Tenant({ ...this.props, status, updatedAt: new Date() });
  }

  withCredential(credential: TenantCredentialMetadata): Tenant {
    return new Tenant({ ...this.props, credential, updatedAt: new Date() });
  }
}
