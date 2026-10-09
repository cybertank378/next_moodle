// File: src/core/security/PasswordGenerator.ts

/**
 * Generates a cryptographically secure random password compliant with Moodle's
 * default password policy:
 * - At least 8 characters (default 12)
 * - At least 1 lowercase letter
 * - At least 1 uppercase letter
 * - At least 1 digit
 * - At least 1 special character / symbol
 */
export function generateSecureMoodlePassword(length = 12): string {
  const lowercase = "abcdefghjkmnpqrstuvwxyz";
  const uppercase = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  const all = lowercase + uppercase + numbers + symbols;

  const targetLength = Math.max(8, length);
  const result: string[] = [];

  const getRandChar = (chars: string): string => {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const index = (array[0] ?? 0) % chars.length;
    return chars[index] ?? chars[0] ?? "x";
  };

  // Guarantee at least one of each required character class
  result.push(getRandChar(lowercase));
  result.push(getRandChar(uppercase));
  result.push(getRandChar(numbers));
  result.push(getRandChar(symbols));

  for (let i = result.length; i < targetLength; i++) {
    result.push(getRandChar(all));
  }

  // Cryptographically shuffle array using Fisher-Yates
  for (let i = result.length - 1; i > 0; i--) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    const j = (array[0] ?? 0) % (i + 1);
    const temp = result[i] ?? "";
    result[i] = result[j] ?? "";
    result[j] = temp;
  }

  return result.join("");
}
