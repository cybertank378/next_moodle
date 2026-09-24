import path from "node:path";
import { fileURLToPath } from "node:url";
import { config } from "dotenv";

const PLACEHOLDER_PATTERN = /replace_with|change_me|example/i;

export function validateServerEnvironment(environment) {
  const errors = [];
  const databaseUrl = environment.DATABASE_URL;
  const sessionSecret = environment.AUTH_SESSION_SECRET;
  const encryptionKey = environment.TENANT_ENCRYPTION_MASTER_KEY;

  if (!databaseUrl || PLACEHOLDER_PATTERN.test(databaseUrl)) {
    errors.push("DATABASE_URL wajib dikonfigurasi.");
  } else {
    try {
      new URL(databaseUrl);
    } catch {
      errors.push("DATABASE_URL harus berupa URL yang valid.");
    }
  }

  if (
    !sessionSecret ||
    PLACEHOLDER_PATTERN.test(sessionSecret) ||
    sessionSecret.length < 32
  ) {
    errors.push("AUTH_SESSION_SECRET wajib berisi minimal 32 karakter.");
  }

  if (!/^[a-fA-F0-9]{64}$/.test(encryptionKey ?? "")) {
    errors.push(
      "TENANT_ENCRYPTION_MASTER_KEY wajib berisi tepat 64 karakter heksadesimal.",
    );
  }

  return errors;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  config({ path: path.resolve(process.cwd(), ".env"), quiet: true });

  const errors = validateServerEnvironment(process.env);
  if (errors.length > 0) {
    console.error("Konfigurasi environment tidak valid:");
    for (const error of errors) console.error(`- ${error}`);
    process.exitCode = 1;
  } else {
    console.log("Konfigurasi environment valid.");
  }
}
