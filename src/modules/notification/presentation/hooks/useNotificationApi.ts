// Files: src/modules/notification/presentation/hooks/useNotificationApi.ts
"use client";

import {
  type NotificationContextValue,
  useNotificationContext,
} from "@/modules/notification/presentation/context/NotificationContext";

export function useNotificationApi(): NotificationContextValue {
  return useNotificationContext();
}

export { useNotificationContext };
