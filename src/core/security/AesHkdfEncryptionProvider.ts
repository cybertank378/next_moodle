import {
  createCipheriv,
  createDecipheriv,
  hkdfSync,
  randomBytes,
} from "node:crypto";
import { SecurityError } from "@/core/errors/SecurityError";

export interface TenantEncryptionProvider {
  encrypt(plainText: string, tenantId: string): Promise<string>;
  decrypt(cipherText: string, tenantId: string): Promise<string>;
}

/**
 * Tenant-isolated AES-256-GCM encryption provider with HKDF-SHA256 key derivation.
 *
 * Each tenant receives a distinct 256-bit encryption key derived cryptographically
 * from the master key and the tenant's unique identifier.
 *
 * Payload format: base64( 12-byte IV + 16-byte AuthTag + Ciphertext )
 */
export class AesHkdfEncryptionProvider implements TenantEncryptionProvider {
  private readonly masterKey: Buffer;

  constructor(masterKeyInput?: string | Buffer) {
    const rawKey =
      masterKeyInput ??
      process.env.TENANT_ENCRYPTION_MASTER_KEY ??
      process.env.ENCRYPTION_KEY;

    if (!rawKey) {
      throw new Error(
        "Master encryption key is required. Set TENANT_ENCRYPTION_MASTER_KEY or pass to constructor.",
      );
    }

    if (Buffer.isBuffer(rawKey)) {
      this.masterKey = rawKey;
    } else if (typeof rawKey === "string") {
      if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
        this.masterKey = Buffer.from(rawKey, "hex");
      } else if (rawKey.length === 44 && rawKey.endsWith("=")) {
        this.masterKey = Buffer.from(rawKey, "base64");
      } else {
        this.masterKey = Buffer.from(rawKey, "utf8");
      }
    } else {
      throw new Error("Invalid master key format");
    }

    if (this.masterKey.length !== 32) {
      throw new Error(
        `AesHkdfEncryptionProvider requires a 32-byte (256-bit) master key, got ${this.masterKey.length} bytes`,
      );
    }
  }

  /**
   * Derives a dedicated 256-bit cryptographic key for a specific tenant using HKDF-SHA256.
   */
  private deriveTenantKey(tenantId: string): Buffer {
    if (!tenantId || tenantId.trim().length === 0) {
      throw new SecurityError("TenantId is required for key derivation");
    }

    const salt = Buffer.from(tenantId, "utf8");
    const info = Buffer.from(`next-moodle:tenant:${tenantId}`, "utf8");

    const derivedKey = hkdfSync("sha256", this.masterKey, salt, info, 32);
    return Buffer.from(derivedKey);
  }

  /**
   * Encrypts plaintext using AES-256-GCM with a tenant-derived key.
   * Produces a single base64 string formatted as: iv(12) + authTag(16) + ciphertext.
   */
  async encrypt(plainText: string, tenantId: string): Promise<string> {
    const tenantKey = this.deriveTenantKey(tenantId);
    const iv = randomBytes(12);

    const cipher = createCipheriv("aes-256-gcm", tenantKey, iv);
    const ciphertext = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);
    const authTag = cipher.getAuthTag();

    const payload = Buffer.concat([iv, authTag, ciphertext]);
    return payload.toString("base64");
  }

  /**
   * Decrypts a base64 payload using AES-256-GCM with a tenant-derived key.
   * Enforces tenant isolation: if the ciphertext was encrypted for Tenant A,
   * attempting to decrypt with Tenant B will fail authentication.
   */
  async decrypt(cipherText: string, tenantId: string): Promise<string> {
    const tenantKey = this.deriveTenantKey(tenantId);
    const payload = Buffer.from(cipherText, "base64");

    if (payload.length < 28) {
      throw new SecurityError(
        "Invalid ciphertext: payload too short to contain IV and auth tag",
      );
    }

    const iv = payload.subarray(0, 12);
    const authTag = payload.subarray(12, 28);
    const ciphertext = payload.subarray(28);

    try {
      const decipher = createDecipheriv("aes-256-gcm", tenantKey, iv);
      decipher.setAuthTag(authTag);

      const decrypted = Buffer.concat([
        decipher.update(ciphertext),
        decipher.final(),
      ]);

      return decrypted.toString("utf8");
    } catch {
      throw new SecurityError(
        "Ciphertext authentication failed: data cannot be decrypted or violates tenant isolation",
        { tenantId },
      );
    }
  }
}
