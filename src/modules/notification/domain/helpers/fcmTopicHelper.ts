// Files: src/modules/notification/domain/helpers/fcmTopicHelper.ts

/**
 * Normalizes an FCM topic string to conform with Firebase rules:
 * matches regex `[a-zA-Z0-9-_.~%]+`.
 */
export function normalizeFcmTopic(
  tenantId: string | null | undefined,
  role: string,
  userId: string,
): string {
  const tenantPart = tenantId?.trim() || "platform";
  const raw = `${tenantPart}-${role.trim()}-${userId.trim()}`;
  return raw.replace(/[^a-zA-Z0-9-_.~%]/g, "_");
}
