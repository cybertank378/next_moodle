import { describe, expect, it } from "vitest";
import { AesEncryptionProvider } from "@/core/security/EncryptionProvider";

describe("AesEncryptionProvider", () => {
  // 32-byte key in hex (64 hex characters)
  const secretKey =
    "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";

  it("should encrypt and decrypt plaintext accurately", async () => {
    const provider = new AesEncryptionProvider(secretKey);
    const plainText = "moodle_webservice_token_secret_12345";

    const cipherText = await provider.encrypt(plainText);
    expect(cipherText).toBeDefined();
    expect(cipherText).not.toBe(plainText);

    const decrypted = await provider.decrypt(cipherText);
    expect(decrypted).toBe(plainText);
  });

  it("should produce different ciphertexts for the same plaintext due to random IV", async () => {
    const provider = new AesEncryptionProvider(secretKey);
    const plainText = "consistent_message";

    const cipher1 = await provider.encrypt(plainText);
    const cipher2 = await provider.encrypt(plainText);

    expect(cipher1).not.toBe(cipher2);

    expect(await provider.decrypt(cipher1)).toBe(plainText);
    expect(await provider.decrypt(cipher2)).toBe(plainText);
  });

  it("should fail decryption if ciphertext or auth tag is tampered with", async () => {
    const provider = new AesEncryptionProvider(secretKey);
    const plainText = "tamper_test";

    const cipherText = await provider.encrypt(plainText);
    // Tamper the ciphertext
    const tampered =
      cipherText.slice(0, 10) +
      (cipherText[10] === "a" ? "b" : "a") +
      cipherText.slice(11);

    await expect(provider.decrypt(tampered)).rejects.toThrow();
  });
});
