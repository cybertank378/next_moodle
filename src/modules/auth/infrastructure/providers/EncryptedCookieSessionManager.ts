import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
} from "node:crypto";
import { validateCurrentActor } from "@/core/auth/CurrentActor";
import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type {
  AppSessionPayload,
  AuthSessionManager,
  CreatedAppSession,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";

interface SessionEnvelope {
  readonly actor: unknown;
  readonly moodleToken: string;
  readonly expiresAt: string;
  readonly revokedAt?: string;
}

export interface EncryptedCookieSessionManagerOptions {
  readonly secret?: string;
  readonly ttlSeconds?: number;
  readonly now?: () => Date;
}

function base64UrlEncode(input: Buffer): string {
  return input
    .toString("base64")
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function base64UrlDecode(input: string): Buffer {
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/");
  return Buffer.from(
    base64.padEnd(Math.ceil(base64.length / 4) * 4, "="),
    "base64",
  );
}

function deriveKey(secret: string): Buffer {
  return createHash("sha256").update(secret).digest();
}

export class EncryptedCookieSessionManager implements AuthSessionManager {
  private readonly key: Buffer;
  private readonly ttlSeconds: number;
  private readonly now: () => Date;
  private readonly revoked = new Set<string>();
  private readonly revokedActorIds = new Set<string>();

  constructor(options: EncryptedCookieSessionManagerOptions = {}) {
    const secret =
      options.secret ||
      process.env.AUTH_SESSION_SECRET ||
      process.env.NEXTAUTH_SECRET;
    if (!secret || secret.length < 32) {
      throw new Error(
        "AUTH_SESSION_SECRET must contain at least 32 characters.",
      );
    }
    this.key = deriveKey(secret);
    this.ttlSeconds = options.ttlSeconds ?? 60 * 60 * 8;
    this.now = options.now ?? (() => new Date());
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
    if (this.revoked.has(cookieValue)) {
      throw new UnauthorizedError("Session has been revoked.");
    }
    const envelope = this.decrypt(cookieValue);
    const actor = validateCurrentActor(envelope.actor);
    if (this.revokedActorIds.has(actor.id || actor.userId)) {
      throw new UnauthorizedError(
        "All sessions for this actor have been revoked.",
      );
    }
    if (this.now() >= new Date(envelope.expiresAt)) {
      throw new UnauthorizedError("Session has expired.");
    }
    if (!envelope.moodleToken) {
      throw new UnauthorizedError("Session is invalid.");
    }
    return {
      actor,
      moodleToken: envelope.moodleToken,
    };
  }

  async refreshSession(cookieValue: string): Promise<CreatedAppSession> {
    const payload = await this.resolveSession(cookieValue);
    return this.createSession(payload);
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
    const tag = cipher.getAuthTag();
    return [
      base64UrlEncode(iv),
      base64UrlEncode(tag),
      base64UrlEncode(ciphertext),
    ].join(".");
  }

  private decrypt(cookieValue: string): SessionEnvelope {
    try {
      const [ivPart, tagPart, ciphertextPart] = cookieValue.split(".");
      if (!ivPart || !tagPart || !ciphertextPart) {
        throw new Error("Invalid session envelope.");
      }
      const decipher = createDecipheriv(
        "aes-256-gcm",
        this.key,
        base64UrlDecode(ivPart),
      );
      decipher.setAuthTag(base64UrlDecode(tagPart));
      const plaintext = Buffer.concat([
        decipher.update(base64UrlDecode(ciphertextPart)),
        decipher.final(),
      ]).toString("utf8");
      return JSON.parse(plaintext) as SessionEnvelope;
    } catch {
      throw new UnauthorizedError("Invalid session.");
    }
  }
}
