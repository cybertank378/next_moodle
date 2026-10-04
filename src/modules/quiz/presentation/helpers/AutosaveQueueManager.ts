export type AttemptSyncState =
  | "ready"
  | "saving"
  | "saved"
  | "offline"
  | "submitting";

export interface QueuedAnswerItem {
  slot: number;
  value: string;
}

export interface AutosaveQueueOptions {
  attemptId: number;
  saveFn: (answers: Record<string, string | number>) => Promise<boolean>;
  initialOnline?: boolean;
  onStateChange?: (state: AttemptSyncState) => void;
}

export class AutosaveQueueManager {
  private readonly attemptId: number;
  private readonly saveFn: (
    answers: Record<string, string | number>,
  ) => Promise<boolean>;
  private readonly onStateChange?: (state: AttemptSyncState) => void;

  private isOnline: boolean;
  private syncState: AttemptSyncState;
  private queue: QueuedAnswerItem[] = [];
  private isFlushing = false;

  constructor(options: AutosaveQueueOptions) {
    this.attemptId = options.attemptId;
    this.saveFn = options.saveFn;
    this.onStateChange = options.onStateChange;

    this.isOnline = options.initialOnline ?? true;
    this.syncState = this.isOnline ? "ready" : "offline";
  }

  public getState(): AttemptSyncState {
    return this.syncState;
  }

  public getQueue(): readonly QueuedAnswerItem[] {
    return [...this.queue];
  }

  private setState(newState: AttemptSyncState): void {
    if (this.syncState !== newState) {
      this.syncState = newState;
      this.onStateChange?.(newState);
    }
  }

  public setOnline(online: boolean): void {
    this.isOnline = online;
    if (!online) {
      this.setState("offline");
    } else if (this.syncState === "offline") {
      this.setState(this.queue.length > 0 ? "ready" : "saved");
    }
  }

  public enqueueAnswer(slot: number, value: string): void {
    const existingIndex = this.queue.findIndex((item) => item.slot === slot);
    if (existingIndex >= 0) {
      this.queue[existingIndex] = { slot, value };
    } else {
      this.queue.push({ slot, value });
    }

    if (!this.isOnline) {
      this.setState("offline");
    }
  }

  public async flushQueue(): Promise<boolean> {
    if (this.queue.length === 0) {
      if (this.isOnline) {
        this.setState("saved");
      }
      return true;
    }

    if (!this.isOnline) {
      this.setState("offline");
      return false;
    }

    if (this.isFlushing) {
      return false;
    }

    this.isFlushing = true;
    this.setState("saving");

    try {
      const answersPayload: Record<string, string | number> = {};
      for (const item of this.queue) {
        answersPayload[`q${item.slot}:1_answer`] = item.value;
      }

      const success = await this.saveFn(answersPayload);

      if (success) {
        this.queue = [];
        this.setState("saved");
        return true;
      }

      this.setState("offline");
      return false;
    } catch {
      this.setState("offline");
      return false;
    } finally {
      this.isFlushing = false;
    }
  }
}
