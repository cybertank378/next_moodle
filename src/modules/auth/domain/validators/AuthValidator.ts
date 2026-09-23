import { ValidationError } from "@/core/errors/ValidationError";
import type { LoginRequestDto } from "@/modules/auth/domain/dto/AuthRequestDto";

export function validateLoginRequest(input: LoginRequestDto): LoginRequestDto {
  const tenant = input.tenant.trim();
  const username = input.username.trim();

  if (!tenant) throw new ValidationError("Tenant wajib diisi.");
  if (!username) throw new ValidationError("Username wajib diisi.");
  if (!input.password) throw new ValidationError("Password wajib diisi.");

  return {
    tenant,
    username,
    password: input.password,
  };
}
