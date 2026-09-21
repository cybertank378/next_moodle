import type { CurrentActor } from "./CurrentActor";

export interface Session {
  id: string;
  token: string;
  actor: CurrentActor;
  expiresAt: Date;
  isRevoked: boolean;
  createdAt: Date;
}
