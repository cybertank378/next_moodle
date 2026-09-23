import { NextResponse } from "next/server";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { ApiResponse } from "@/core/http/ApiResponse";
import { HttpStatus } from "@/core/http/HttpStatus";
import { mapErrorToHttpResponse } from "@/core/http/mapErrorToHttpResponse";
import type { GetCurrentSessionUseCase } from "@/modules/auth/application/usecases/GetCurrentSessionUseCase";
import type { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";
import type { LogoutAllUseCase } from "@/modules/auth/application/usecases/LogoutAllUseCase";
import type { LogoutUseCase } from "@/modules/auth/application/usecases/LogoutUseCase";
import type { RefreshSessionUseCase } from "@/modules/auth/application/usecases/RefreshSessionUseCase";
import { toPublicActorDto } from "@/modules/auth/domain/dto/AuthResponseDto";
import { parseLoginBody } from "@/modules/auth/infrastructure/validators/auth.validator";

export interface AuthControllerDependencies {
  readonly login: Pick<LoginUseCase, "execute">;
  readonly getCurrentSession: Pick<GetCurrentSessionUseCase, "execute">;
  readonly logout: Pick<LogoutUseCase, "execute">;
  readonly logoutAll: Pick<LogoutAllUseCase, "execute">;
  readonly refresh: Pick<RefreshSessionUseCase, "execute">;
}

const SESSION_COOKIE = "session_token";

function respond(response: ApiResponse): NextResponse {
  return NextResponse.json(response.body, { status: response.status });
}

async function parseJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new UnauthorizedError("Body permintaan tidak valid.");
  }
}

function readSessionCookie(req: Request): string {
  const cookieHeader = req.headers.get("cookie") || "";
  const sessionCookie = cookieHeader
    .split(";")
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${SESSION_COOKIE}=`));
  const value = sessionCookie?.substring(`${SESSION_COOKIE}=`.length);
  if (!value) throw new UnauthorizedError("Sesi tidak ditemukan.");
  return decodeURIComponent(value);
}

function setSessionCookie(
  response: NextResponse,
  value: string,
  expiresAt: Date,
): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export class AuthController {
  constructor(private readonly deps: AuthControllerDependencies) {}

  async login(req: Request): Promise<NextResponse> {
    try {
      const result = await this.deps.login.execute(
        parseLoginBody(await parseJson(req)),
      );
      const response = respond(
        ApiResponse.success(
          {
            actor: toPublicActorDto(result.actor),
            expiresAt: result.sessionCookie.expiresAt.toISOString(),
          },
          undefined,
          HttpStatus.CREATED,
        ),
      );
      setSessionCookie(
        response,
        result.sessionCookie.value,
        result.sessionCookie.expiresAt,
      );
      return response;
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async currentSession(req: Request): Promise<NextResponse> {
    try {
      const session = await this.deps.getCurrentSession.execute(
        readSessionCookie(req),
      );
      return respond(
        ApiResponse.success({ actor: toPublicActorDto(session.actor) }),
      );
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async refresh(req: Request): Promise<NextResponse> {
    try {
      const session = await this.deps.refresh.execute(readSessionCookie(req));
      const response = respond(
        ApiResponse.success({ expiresAt: session.expiresAt.toISOString() }),
      );
      setSessionCookie(response, session.cookieValue, session.expiresAt);
      return response;
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async logout(req: Request): Promise<NextResponse> {
    try {
      await this.deps.logout.execute(readSessionCookie(req));
      const response = respond(ApiResponse.success({ loggedOut: true }));
      clearSessionCookie(response);
      return response;
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }

  async logoutAll(req: Request): Promise<NextResponse> {
    try {
      const session = await this.deps.getCurrentSession.execute(
        readSessionCookie(req),
      );
      await this.deps.logoutAll.execute(
        session.actor.id || session.actor.userId,
      );
      const response = respond(ApiResponse.success({ loggedOut: true }));
      clearSessionCookie(response);
      return response;
    } catch (error) {
      return respond(mapErrorToHttpResponse(error));
    }
  }
}
