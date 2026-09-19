import type { UserRole } from "@/core/auth/CurrentActor";
import { BaseEntity } from "@/core/base/BaseEntity";

export interface AuthenticatedUserProps {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly moodleUserId: number;
  readonly tenantId: string;
  readonly roles: readonly UserRole[];
}

export class AuthenticatedUser extends BaseEntity<string> {
  public readonly username: string;
  public readonly email: string;
  public readonly firstname: string;
  public readonly lastname: string;
  public readonly moodleUserId: number;
  public readonly tenantId: string;
  public readonly roles: readonly UserRole[];

  constructor(props: AuthenticatedUserProps) {
    super(props.id);
    this.username = props.username;
    this.email = props.email;
    this.firstname = props.firstname;
    this.lastname = props.lastname;
    this.moodleUserId = props.moodleUserId;
    this.tenantId = props.tenantId;
    this.roles = props.roles;
  }

  public get fullName(): string {
    return `${this.firstname} ${this.lastname}`.trim();
  }
}
