import type { CurrentActor } from "./CurrentActor";

export interface Session {
  readonly id: string;
  readonly token: string;
  readonly actor: CurrentActor;
  readonly expiresAt: Date;
  readonly createdAt: Date;
}
