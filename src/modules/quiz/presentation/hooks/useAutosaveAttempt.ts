"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  type AttemptSyncState,
  AutosaveQueueManager,
  type QueuedAnswerItem,
} from "../helpers/AutosaveQueueManager";

export interface UseAutosaveAttemptProps {
  attemptId: number;
  onSave: (answers: Record<string, string | number>) => Promise<boolean>;
  debounceMs?: number;
  initialOnline?: boolean;
}

export function useAutosaveAttempt({
  attemptId,
  onSave,
  debounceMs = 1000,
  initialOnline,
}: UseAutosaveAttemptProps) {
  const [syncState, setSyncState] = useState<AttemptSyncState>(
    initialOnline === false ? "offline" : "ready",
  );
  const [offlineQueue, setOfflineQueue] = useState<readonly QueuedAnswerItem[]>(
    [],
  );
  const [isOnline, setIsOnline] = useState<boolean>(
    initialOnline ??
      (typeof navigator !== "undefined" ? navigator.onLine : true),
  );

  const managerRef = useRef<AutosaveQueueManager | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  if (!managerRef.current) {
    managerRef.current = new AutosaveQueueManager({
      attemptId,
      saveFn: onSave,
      initialOnline: isOnline,
      onStateChange: (state) => setSyncState(state),
    });
  }

  // Handle prop changes (e.g. In tests or controlled network state)
  useEffect(() => {
    if (initialOnline !== undefined) {
      setIsOnline(initialOnline);
      managerRef.current?.setOnline(initialOnline);
      setSyncState(managerRef.current?.getState() ?? "ready");
      if (initialOnline) {
        void managerRef.current?.flushQueue().then(() => {
          setOfflineQueue(managerRef.current?.getQueue() ?? []);
        });
      }
    }
  }, [initialOnline]);

  // Listen to browser network changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOnline(true);
      managerRef.current?.setOnline(true);
      void managerRef.current?.flushQueue().then(() => {
        setOfflineQueue(managerRef.current?.getQueue() ?? []);
      });
    };

    const handleOffline = () => {
      setIsOnline(false);
      managerRef.current?.setOnline(false);
      setSyncState("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const updateAnswer = useCallback(
    (slot: number, value: string) => {
      managerRef.current?.enqueueAnswer(slot, value);
      const currentQueue = managerRef.current?.getQueue() ?? [];
      setOfflineQueue(currentQueue);

      if (managerRef.current?.getState() === "offline") {
        setSyncState("offline");
        return;
      }

      setSyncState("saving");

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      timerRef.current = setTimeout(async () => {
        await managerRef.current?.flushQueue();
        setOfflineQueue(managerRef.current?.getQueue() ?? []);
      }, debounceMs);
    },
    [debounceMs],
  );

  const flushQueue = useCallback(async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    const success = await managerRef.current?.flushQueue();
    setOfflineQueue(managerRef.current?.getQueue() ?? []);
    return success ?? false;
  }, []);

  return {
    syncState,
    offlineQueue,
    isOnline,
    updateAnswer,
    flushQueue,
  };
}
