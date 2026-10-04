import { ValidationError } from "@/core/errors/ValidationError";
import type { NotificationTab } from "@/modules/notification/domain/types/NotificationTypes";

export interface ParsedNotificationQuery {
  tab: NotificationTab;
  page: number;
  limit: number;
}

export function parseNotificationQuery(
  searchParams: URLSearchParams,
): ParsedNotificationQuery {
  const rawTab = searchParams.get("tab") ?? "unread";
  if (rawTab !== "unread" && rawTab !== "read") {
    throw new ValidationError("Parameter 'tab' harus bernilai 'unread' atau 'read'.");
  }

  const rawPage = searchParams.get("page") ?? "1";
  const page = Number(rawPage);
  if (!Number.isInteger(page) || page < 1) {
    throw new ValidationError("Parameter 'page' harus berupa bilangan bulat positif.");
  }

  const rawLimit = searchParams.get("limit") ?? "10";
  const limit = Number(rawLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
    throw new ValidationError("Parameter 'limit' harus antara 1 dan 100.");
  }

  return { tab: rawTab, page, limit };
}
