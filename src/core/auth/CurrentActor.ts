export type ActorRole =
  | "SUPERADMIN"
  | "TENANT_ADMIN"
  | "TEACHER"
  | "STUDENT"
  | string;

export interface CurrentActor {
  userId: string;
  username: string;
  role: ActorRole;
  tenantId: string;
  email?: string;
}
