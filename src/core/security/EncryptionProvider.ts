import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export interface EncryptionProvider {
  encrypt(plainText: string): Promise<string>;
  decrypt(cipherText: string): Promise<string>;
}

export class AesEncryptionProvider implements EncryptionProvider {
  private readonly key: Buffer;

  constructor(secretKey: string | Buffer) {
    if (typeof secretKey === "string") {
      // If 64 hex characters, parse as hex (32 bytes); otherwise handle buffer
      if (secretKey.length === 64 && /^[0-9a-fA-F]+$/.test(secretKey)) {
        this.key = Buffer.from(secretKey, "hex");
      } else {
        // Pad or truncate to 32 bytes
        const buf = Buffer.alloc(32);
        buf.write(secretKey, "utf-8");
        this.key = buf;
      }
    } else {
      this.key = secretKey;
    }

    if (this.key.length !== 32) {
      throw new Error(
        "AesEncryptionProvider requires a 32-byte (256-bit) secret key",
      );
    }
  }

  async encrypt(plainText: string): Promise<string> {
    const iv = randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = createCipheriv("aes-256-gcm", this.key, iv);

    const encrypted = Buffer.concat([
      cipher.update(plainText, "utf8"),
      cipher.final(),
    ]);

    const authTag = cipher.getAuthTag();

    // Format: iv:authTag:encrypted (hex)
    return `${iv.toString("hex")}:${authTag.toString("hex")}:${encrypted.toString("hex")}`;
  }

  async decrypt(cipherText: string): Promise<string> {
    const parts = cipherText.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid cipherText format");
    }

    const [ivHex, authTagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const encrypted = Buffer.from(encryptedHex, "hex");

    const decipher = createDecipheriv("aes-256-gcm", this.key, iv);
    decipher.setAuthTag(authTag);

    const decrypted = Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]);

    return decrypted.toString("utf8");
  }
}
