import type { CurrentActor } from "@/core/auth/CurrentActor";

export interface PublicActorDto {
  readonly id: string;
  readonly username: string;
  readonly role: string;
  readonly tenantId: string | null;
  readonly moodleUserId: number | null;
  readonly permissions: readonly string[];
}

export interface AuthSessionResponseDto {
  readonly actor: PublicActorDto;
  readonly expiresAt: string;
}

export function toPublicActorDto(actor: CurrentActor): PublicActorDto {
  return {
    id: actor.id || actor.userId,
    username: actor.username,
    role: actor.role,
    tenantId: actor.tenantId,
    moodleUserId: actor.moodleUserId ?? null,
    permissions: actor.permissions || [],
  };
}
