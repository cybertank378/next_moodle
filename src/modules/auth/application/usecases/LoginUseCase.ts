import { ValidationError } from "@/core/errors/ValidationError";
import type { LoginRequestDTO, LoginResponseDTO } from "../../domain/dto";
import type { AuthRepository } from "../../domain/interfaces/AuthRepository";

export class LoginUseCase {
  constructor(private readonly authRepository: AuthRepository) {}

  public async execute(
    dto: LoginRequestDTO,
    tenantId: string,
  ): Promise<LoginResponseDTO> {
    if (!dto.username?.trim()) {
      throw new ValidationError("Username wajib diisi");
    }
    if (!dto.password) {
      throw new ValidationError("Password wajib diisi");
    }

    const user = await this.authRepository.authenticate(
      dto.username,
      dto.password,
      tenantId,
    );

    // In full production, SessionRepository creates HttpOnly session cookie
    return {
      token: `sess_${user.id}_${Date.now()}`,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        roles: user.roles,
      },
    };
  }
}
