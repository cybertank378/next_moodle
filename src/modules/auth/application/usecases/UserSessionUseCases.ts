import type { CurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type { CurrentUserResponseDTO } from "../../domain/dto";

export class GetCurrentUserUseCase {
  public async execute(
    actor: CurrentActor | null,
  ): Promise<CurrentUserResponseDTO> {
    if (!actor) {
      throw new UnauthorizedError("Pengguna belum terautentikasi");
    }

    return {
      id: actor.id ?? actor.userId,
      username: actor.username ?? actor.userId,
      fullName:
        `${actor.firstname ?? ""} ${actor.lastname ?? ""}`.trim() ||
        (actor.username ?? actor.userId),
      email: actor.email ?? "",
      tenantId: actor.tenantId,
      roles: actor.roles,
    };
  }
}

export class LogoutUseCase {
  public async execute(): Promise<{ success: true }> {
    return { success: true };
  }
}
