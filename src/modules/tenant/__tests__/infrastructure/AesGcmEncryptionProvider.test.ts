import { describe, expect, it } from "vitest";
import { InfrastructureError } from "@/core/errors/InfrastructureError";
import { AesGcmEncryptionProvider } from "../../infrastructure/providers/AesGcmEncryptionProvider";

describe("AesGcmEncryptionProvider", () => {
  // 32-byte (64 hex characters) test key
  const testKeyHex =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
  const provider = new AesGcmEncryptionProvider(testKeyHex);

  it("should encrypt plaintext and decrypt back to original text", () => {
    const plainToken = "secret_moodle_wstoken_1234567890";
    const encrypted = provider.encrypt(plainToken);

    expect(encrypted.encryptedValue).not.toBe(plainToken);
    expect(encrypted.iv).toBeDefined();
    expect(encrypted.authTag).toBeDefined();
    expect(encrypted.keyVersion).toBe("v1");

    const decrypted = provider.decrypt(encrypted);
    expect(decrypted).toBe(plainToken);
  });

  it("should generate unique IV for every encryption call", () => {
    const plain = "identical_token_string";
    const enc1 = provider.encrypt(plain);
    const enc2 = provider.encrypt(plain);

    expect(enc1.iv).not.toBe(enc2.iv);
    expect(enc1.encryptedValue).not.toBe(enc2.encryptedValue);

    expect(provider.decrypt(enc1)).toBe(plain);
    expect(provider.decrypt(enc2)).toBe(plain);
  });

  it("should fail decryption if auth tag is tampered", () => {
    const encrypted = provider.encrypt("sensitive_token");
    const tampered = {
      ...encrypted,
      authTag: "00".repeat(16),
    };

    expect(() => provider.decrypt(tampered)).toThrow(InfrastructureError);
    expect(() => provider.decrypt(tampered)).toThrowError(/dekripsi/i);
  });

  it("should fail decryption if ciphertext is tampered", () => {
    const encrypted = provider.encrypt("sensitive_token");
    const tampered = {
      ...encrypted,
      encryptedValue: "tampered_ciphertext",
    };

    expect(() => provider.decrypt(tampered)).toThrow(InfrastructureError);
  });

  it("should fail decryption if decrypted with wrong key", () => {
    const wrongKeyHex =
      "fedcba9876543210fedcba9876543210fedcba9876543210fedcba9876543210";
    const otherProvider = new AesGcmEncryptionProvider(wrongKeyHex);
    const encrypted = provider.encrypt("some_moodle_token");

    expect(() => otherProvider.decrypt(encrypted)).toThrow(InfrastructureError);
  });

  it("should never expose secret token in error message", () => {
    const secret = "very_secret_never_leak_token";
    const encrypted = provider.encrypt(secret);
    const tampered = { ...encrypted, authTag: "invalid_tag" };

    try {
      provider.decrypt(tampered);
      expect.unreachable("Should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(InfrastructureError);
      expect((err as Error).message).not.toContain(secret);
    }
  });
});
