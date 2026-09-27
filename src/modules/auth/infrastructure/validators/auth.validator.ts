import { ValidationError } from "@/core/errors/ValidationError";
import type { LoginRequestDto } from "@/modules/auth/domain/dto/AuthRequestDto";

export function parseLoginBody(body: unknown): LoginRequestDto {
  if (!body || typeof body !== "object") {
    throw new ValidationError("Body login harus berupa JSON object.");
  }
  const input = body as Record<string, unknown>;
  return {
    username: typeof input.username === "string" ? input.username : "",
    password: typeof input.password === "string" ? input.password : "",
  } as LoginRequestDto;
}
