import type { Session } from "./Session";

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  create(sessionData: Omit<Session, "id" | "createdAt">): Promise<Session>;
  revoke(token: string): Promise<void>;
}
