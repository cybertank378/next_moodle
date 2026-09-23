import { describe, expect, it } from "vitest";
import { AesHkdfEncryptionProvider } from "@/core/security/AesHkdfEncryptionProvider";

describe("AesHkdfEncryptionProvider", () => {
  const masterKeyHex =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const tenantA = "tenant-uuid-1111";
  const tenantB = "tenant-uuid-2222";

  it("should encrypt and decrypt a plaintext string for the same tenant", async () => {
    const provider = new AesHkdfEncryptionProvider(masterKeyHex);
    const secret = "moodle-super-secret-admin-token-12345";

    const encrypted = await provider.encrypt(secret, tenantA);
    expect(encrypted).not.toBe(secret);
    expect(typeof encrypted).toBe("string");

    const decrypted = await provider.decrypt(encrypted, tenantA);
    expect(decrypted).toBe(secret);
  });

  it("should output valid base64 payload with minimum length for IV(12) + Tag(16) + Ciphertext", async () => {
    const provider = new AesHkdfEncryptionProvider(masterKeyHex);
    const secret = "token";

    const encrypted = await provider.encrypt(secret, tenantA);
    const buffer = Buffer.from(encrypted, "base64");

    // IV (12) + Tag (16) + ciphertext (at least 5 for 'token') = at least 33 bytes
    expect(buffer.length).toBeGreaterThanOrEqual(28 + secret.length);
  });

  it("should fail to decrypt when using a different tenantId (Tenant Isolation)", async () => {
    const provider = new AesHkdfEncryptionProvider(masterKeyHex);
    const secret = "tenant-a-confidential-token";

    const encryptedForTenantA = await provider.encrypt(secret, tenantA);

    // Decrypting Tenant A's ciphertext using Tenant B's ID must fail
    await expect(
      provider.decrypt(encryptedForTenantA, tenantB),
    ).rejects.toThrow(/authentication failed|tenant isolation/i);
  });

  it("should fail to decrypt tampered ciphertext or invalid base64", async () => {
    const provider = new AesHkdfEncryptionProvider(masterKeyHex);
    const secret = "tamper-test-token";

    const encrypted = await provider.encrypt(secret, tenantA);
    const buffer = Buffer.from(encrypted, "base64");

    // Tamper with the last byte
    buffer[buffer.length - 1] ^= 0xff;
    const tampered = buffer.toString("base64");

    await expect(provider.decrypt(tampered, tenantA)).rejects.toThrow();
  });

  it("should reject payload that is too short for IV and auth tag", async () => {
    const provider = new AesHkdfEncryptionProvider(masterKeyHex);
    const shortBase64 = Buffer.from("short-payload").toString("base64");

    await expect(provider.decrypt(shortBase64, tenantA)).rejects.toThrow(
      /too short/i,
    );
  });

  it("should throw if master key is invalid length", () => {
    expect(() => new AesHkdfEncryptionProvider("too-short-key")).toThrow(
      /32-byte/i,
    );
  });
});
