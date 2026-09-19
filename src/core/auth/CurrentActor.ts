export type UserRole = "student" | "teacher" | "admin" | "superadmin" | string;

export interface CurrentActor {
  readonly userId: string;
  readonly tenantId: string;
  readonly roles: readonly string[];
  // Optional convenience fields for downstream consumers
  readonly id?: string;
  readonly username?: string;
  readonly email?: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly moodleUserId?: number;
}
