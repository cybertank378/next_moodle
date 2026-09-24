import "server-only";

import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import type { PrismaClient } from "@prisma/client";
import { validateCurrentActor } from "@/core/auth/CurrentActor";
import { ForbiddenError } from "@/core/errors/ForbiddenError";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { NotFoundError } from "@/core/errors/NotFoundError";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { MoodleRestClient } from "@/core/moodle/MoodleRestClient";
import type {
  AppSessionPayload,
  AuthSessionManager,
  CreatedAppSession,
  LoginTenant,
  MoodleAuthProvider,
  MoodleLoginResult,
  TenantAuthResolver,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

interface SessionEnvelope {
  readonly actor: unknown;
  readonly moodleToken: string;
  readonly expiresAt: string;
}
interface MoodleTokenResponse {
  readonly token?: string;
  readonly error?: string;
}
interface MoodleSiteInfoResponse {
  readonly userid?: number;
  readonly username?: string;
  readonly fullname?: string;
  readonly firstname?: string;
  readonly lastname?: string;
  readonly useremail?: string;
}
export interface AuthRepositoryOptions {
  readonly secret?: string;
  readonly ttlSeconds?: number;
  readonly now?: () => Date;
}

function encode(input: Buffer): string {
  return input
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}
function decode(input: string): Buffer {
  return Buffer.from(
    input
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(Math.ceil(input.length / 4) * 4, "="),
    "base64",
  );
}

export class AuthRepository
  implements TenantAuthResolver, MoodleAuthProvider, AuthSessionManager
{
  private readonly key: Buffer;
  private readonly ttlSeconds: number;
  private readonly now: () => Date;
  private readonly revoked = new Set<string>();
  private readonly revokedActorIds = new Set<string>();

  constructor(
    options: AuthRepositoryOptions = {},
    private readonly prisma?: PrismaClient,
  ) {
    const secret = options.secret || process.env.AUTH_SESSION_SECRET;
    if (!secret || secret.length < 32)
      throw new Error(
        "AUTH_SESSION_SECRET must contain at least 32 characters.",
      );
    this.key = createHash("sha256").update(secret).digest();
    this.ttlSeconds = options.ttlSeconds ?? 60 * 60 * 8;
    this.now = options.now ?? (() => new Date());
  }

  async resolveLoginTenant(identifier: string): Promise<LoginTenant> {
    if (!this.prisma)
      throw new InfrastructureError(
        "Auth repository requires Prisma for tenant resolution.",
      );
    const normalized = identifier.trim().toLowerCase();
    const tenant = await this.prisma.tenant.findFirst({
      where: { OR: [{ slug: normalized }, { customDomain: normalized }] },
      include: { credential: true },
    });
    if (!tenant) throw new NotFoundError("Tenant tidak ditemukan.");
    if (tenant.status !== "ACTIVE")
      throw new ForbiddenError("Tenant tidak aktif.");
    if (!tenant.credential)
      throw new NotFoundError("Konfigurasi Moodle tenant belum tersedia.");
    return {
      tenantId: tenant.id,
      slug: tenant.slug,
      status: tenant.status,
      moodleUrl: tenant.credential.moodleUrl,
    };
  }

  async authenticateStudent(input: {
    readonly tenant: LoginTenant;
    readonly username: string;
    readonly password: string;
  }): Promise<MoodleLoginResult> {
    const response = await fetch(
      new URL("/login/token.php", input.tenant.moodleUrl),
      {
        method: "POST",
        headers: { "content-type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          username: input.username,
          password: input.password,
          service: "nextjs_student",
        }),
        cache: "no-store",
      },
    );
    const tokenPayload = (await response.json()) as MoodleTokenResponse;
    if (!response.ok || !tokenPayload.token)
      throw new UnauthorizedError(tokenPayload.error || "Login Moodle gagal.");
    const siteInfo = await new MoodleRestClient({
      baseUrl: input.tenant.moodleUrl,
      token: tokenPayload.token,
    }).call<MoodleSiteInfoResponse>(
      "core_webservice_get_site_info",
      {},
      { requestKind: "safe-read" },
    );
    if (!siteInfo.userid || !siteInfo.username)
      throw new InfrastructureError("Moodle site info response is incomplete.");
    return {
      token: tokenPayload.token,
      siteInfo: {
        userId: siteInfo.userid,
        username: siteInfo.username,
        fullName:
          siteInfo.fullname ||
          [siteInfo.firstname, siteInfo.lastname].filter(Boolean).join(" "),
        email: siteInfo.useremail,
      },
    };
  }

  async createSession(payload: AppSessionPayload): Promise<CreatedAppSession> {
    const expiresAt = new Date(this.now().getTime() + this.ttlSeconds * 1000);
    return {
      cookieValue: this.encrypt({
        actor: payload.actor,
        moodleToken: payload.moodleToken,
        expiresAt: expiresAt.toISOString(),
      }),
      expiresAt,
    };
  }

  async resolveSession(cookieValue: string): Promise<AppSessionPayload> {
    if (this.revoked.has(cookieValue))
      throw new UnauthorizedError("Session has been revoked.");
    const envelope = this.decrypt(cookieValue);
    const actor = validateCurrentActor(envelope.actor);
    if (this.revokedActorIds.has(actor.id || actor.userId))
      throw new UnauthorizedError(
        "All sessions for this actor have been revoked.",
      );
    if (this.now() >= new Date(envelope.expiresAt))
      throw new UnauthorizedError("Session has expired.");
    if (!envelope.moodleToken)
      throw new UnauthorizedError("Session is invalid.");
    return { actor, moodleToken: envelope.moodleToken };
  }

  async refreshSession(cookieValue: string): Promise<CreatedAppSession> {
    return this.createSession(await this.resolveSession(cookieValue));
  }
  async revokeSession(cookieValue: string): Promise<void> {
    this.revoked.add(cookieValue);
  }
  async revokeAllForActor(actorId: string): Promise<void> {
    this.revokedActorIds.add(actorId);
  }

  private encrypt(envelope: SessionEnvelope): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);
    const ciphertext = Buffer.concat([
      cipher.update(JSON.stringify(envelope), "utf8"),
      cipher.final(),
    ]);
    return [encode(iv), encode(cipher.getAuthTag()), encode(ciphertext)].join(
      ".",
    );
  }
  private decrypt(cookieValue: string): SessionEnvelope {
    try {
      const [iv, tag, ciphertext] = cookieValue.split(".");
      if (!iv || !tag || !ciphertext)
        throw new Error("Invalid session envelope.");
      const decipher = createDecipheriv("aes-256-gcm", this.key, decode(iv));
      decipher.setAuthTag(decode(tag));
      return JSON.parse(
        Buffer.concat([
          decipher.update(decode(ciphertext)),
          decipher.final(),
        ]).toString("utf8"),
      ) as SessionEnvelope;
    } catch {
      throw new UnauthorizedError("Invalid session.");
    }
  }
}
