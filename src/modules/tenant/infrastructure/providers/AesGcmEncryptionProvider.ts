import "server-only";
import crypto from "node:crypto";
import { InfrastructureError } from "@/core/errors/InfrastructureError";

export interface EncryptedPayload {
  readonly encryptedValue: string;
  readonly iv: string;
  readonly authTag: string;
  readonly keyVersion: string;
}

const ALGORITHM = "aes-256-gcm";
const CURRENT_KEY_VERSION = "v1";
const DEFAULT_DEV_KEY =
  "dev_tenant_encryption_key_32bytes_sample_next_moodle_2026!";

export class AesGcmEncryptionProvider {
  private readonly keyBuffer: Buffer;

  constructor(customKey?: string) {
    const rawKey =
      customKey ||
      process.env.TENANT_CREDENTIAL_ENCRYPTION_KEY ||
      DEFAULT_DEV_KEY;

    if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
      this.keyBuffer = Buffer.from(rawKey, "hex");
    } else {
      // Hash string with sha256 to ensure exact 32-byte key
      this.keyBuffer = crypto.createHash("sha256").update(rawKey).digest();
    }
  }

  public encrypt(plainText: string): EncryptedPayload {
    try {
      const iv = crypto.randomBytes(12);
      const cipher = crypto.createCipheriv(ALGORITHM, this.keyBuffer, iv);

      let encrypted = cipher.update(plainText, "utf8", "hex");
      encrypted += cipher.final("hex");

      const authTag = cipher.getAuthTag().toString("hex");

      return {
        encryptedValue: encrypted,
        iv: iv.toString("hex"),
        authTag,
        keyVersion: CURRENT_KEY_VERSION,
      };
    } catch (error) {
      throw new InfrastructureError("Gagal mengenkripsi credential tenant.", {
        code: "TENANT_CREDENTIAL_ENCRYPTION_FAILED",
        cause: error,
      });
    }
  }

  public decrypt(payload: EncryptedPayload): string {
    try {
      const iv = Buffer.from(payload.iv, "hex");
      const authTag = Buffer.from(payload.authTag, "hex");
      const decipher = crypto.createDecipheriv(ALGORITHM, this.keyBuffer, iv);

      decipher.setAuthTag(authTag);

      let decrypted = decipher.update(payload.encryptedValue, "hex", "utf8");
      decrypted += decipher.final("utf8");

      return decrypted;
    } catch (error) {
      throw new InfrastructureError(
        "Gagal mendekripsi credential tenant. Kunci salah atau data credential rusak.",
        { code: "TENANT_CREDENTIAL_DECRYPTION_FAILED", cause: error },
      );
    }
  }
}

export const defaultEncryptionProvider = new AesGcmEncryptionProvider();
