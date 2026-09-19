import type { Session } from "./Session";

export interface SessionRepository {
  findByToken(token: string): Promise<Session | null>;
  save(session: Session): Promise<void>;
  deleteByToken(token: string): Promise<void>;
}
