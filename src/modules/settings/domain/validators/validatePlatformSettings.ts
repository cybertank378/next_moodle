import { ValidationError } from "@/core/errors/ValidationError";
import type { UpdatePlatformSettingsDTO } from "@/modules/settings/domain/dto/PlatformSettingsDTO";

const allowed = new Set([
  "applicationName", "applicationShortName", "applicationDescription",
  "supportEmail", "supportUrl", "pwaThemeColor", "pwaBackgroundColor", "expectedRevision",
]);

function stringField(value: unknown, name: string, min: number, max: number): string {
  if (typeof value !== "string") throw new ValidationError(`${name} harus berupa teks.`);
  const normalized = value.trim();
  if (normalized.length < min || normalized.length > max) {
    throw new ValidationError(`${name} harus memiliki ${min}–${max} karakter.`);
  }
  return normalized;
}

export function validatePlatformSettingsUpdate(input: unknown): UpdatePlatformSettingsDTO {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new ValidationError("Payload pengaturan harus berupa objek.");
  }
  const obj = input as Record<string, unknown>;
  if (Object.keys(obj).some(key => !allowed.has(key)) || Object.keys(obj).length !== allowed.size) {
    throw new ValidationError("Semua field yang diizinkan wajib dikirim tanpa field tambahan.");
  }
  const applicationName = stringField(obj.applicationName, "Nama aplikasi", 2, 100);
  const applicationShortName = stringField(obj.applicationShortName, "Nama singkat", 1, 30);
  const applicationDescription = stringField(obj.applicationDescription, "Deskripsi", 0, 500);
  const supportEmail = obj.supportEmail === null || obj.supportEmail === ""
    ? null : stringField(obj.supportEmail, "Email dukungan", 1, 254);
  const supportUrl = obj.supportUrl === null || obj.supportUrl === ""
    ? null : stringField(obj.supportUrl, "URL dukungan", 1, 2048);
  if (supportEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportEmail)) {
    throw new ValidationError("Format email dukungan tidak valid.");
  }
  if (supportUrl) {
    try {
      const url = new URL(supportUrl);
      if (url.protocol !== "https:" || url.username || url.password || !url.hostname || /\s/.test(supportUrl)) {
        throw new Error("invalid");
      }
    } catch {
      throw new ValidationError("URL dukungan wajib HTTPS tanpa kredensial tertanam.");
    }
  }
  const pwaThemeColor = stringField(obj.pwaThemeColor, "Warna tema", 7, 7);
  const pwaBackgroundColor = stringField(obj.pwaBackgroundColor, "Warna latar", 7, 7);
  if (!/^#[0-9a-fA-F]{6}$/.test(pwaThemeColor) || !/^#[0-9a-fA-F]{6}$/.test(pwaBackgroundColor)) {
    throw new ValidationError("Warna wajib HEX enam digit, contoh #082D61.");
  }
  if (!Number.isSafeInteger(obj.expectedRevision) || (obj.expectedRevision as number) < 1) {
    throw new ValidationError("expectedRevision tidak valid.");
  }
  return {
    applicationName, applicationShortName, applicationDescription, supportEmail, supportUrl,
    pwaThemeColor: pwaThemeColor.toLowerCase(),
    pwaBackgroundColor: pwaBackgroundColor.toLowerCase(),
    expectedRevision: obj.expectedRevision as number,
  };
}
