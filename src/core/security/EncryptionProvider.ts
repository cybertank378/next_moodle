import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export interface IEncryptionProvider {
  encrypt(plainText: string): string;
  decrypt(cipherText: string): string;
}

export class AesEncryptionProvider implements IEncryptionProvider {
  private readonly algorithm = "aes-256-gcm";
  private readonly key: Buffer;

  constructor(secretKeyHexOrString: string) {
    if (!secretKeyHexOrString) {
      throw new Error("Encryption key must not be empty");
    }
    // Derive 32-byte key
    const rawBuffer = Buffer.from(secretKeyHexOrString, "utf-8");
    this.key = Buffer.alloc(32);
    rawBuffer.copy(this.key, 0, 0, Math.min(rawBuffer.length, 32));
  }

  public encrypt(plainText: string): string {
    const iv = randomBytes(12);
    const cipher = createCipheriv(this.algorithm, this.key, iv);
    let encrypted = cipher.update(plainText, "utf8", "hex");
    encrypted += cipher.final("hex");
    const tag = cipher.getAuthTag();

    // Format: iv:tag:encrypted
    return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted}`;
  }

  public decrypt(cipherText: string): string {
    const parts = cipherText.split(":");
    if (parts.length !== 3) {
      throw new Error("Invalid encrypted format. Expected iv:tag:content");
    }

    const [ivHex, tagHex, encryptedHex] = parts as [string, string, string];
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");
    const decipher = createDecipheriv(this.algorithm, this.key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  }
}
