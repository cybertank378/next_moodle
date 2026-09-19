export type UserRole = "student" | "teacher" | "admin" | "superadmin";

export interface CurrentActor {
  readonly id: string;
  readonly username: string;
  readonly email: string;
  readonly firstname: string;
  readonly lastname: string;
  readonly moodleUserId: number;
  readonly tenantId: string;
  readonly roles: readonly UserRole[];
}
