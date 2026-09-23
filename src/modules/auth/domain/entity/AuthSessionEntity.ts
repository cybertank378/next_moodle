import type { CurrentActor } from "@/core/auth/CurrentActor";

export interface AuthSessionEntity {
  readonly actor: CurrentActor;
  readonly expiresAt: Date;
}
