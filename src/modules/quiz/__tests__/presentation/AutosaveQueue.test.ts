import { describe, expect, it, vi } from "vitest";
import { AutosaveQueueManager } from "@/modules/quiz/presentation/helpers/AutosaveQueueManager";

describe("AutosaveQueueManager (RED -> GREEN)", () => {
  it("queues answers when offline and sets syncState to offline", async () => {
    const mockSave = vi.fn().mockResolvedValue(true);

    const manager = new AutosaveQueueManager({
      attemptId: 101,
      saveFn: mockSave,
      initialOnline: false, // offline
    });

    expect(manager.getState()).toBe("offline");
    expect(manager.getQueue()).toHaveLength(0);

    // Student answers question 1 while offline
    manager.enqueueAnswer(1, "choice_b");

    // mockSave must NOT be called when network is offline
    expect(mockSave).not.toHaveBeenCalled();

    // Answer must be safely stored in offline queue
    expect(manager.getQueue()).toEqual([{ slot: 1, value: "choice_b" }]);
    expect(manager.getState()).toBe("offline");
  });

  it("updates existing slot value in queue when answered multiple times while offline", () => {
    const mockSave = vi.fn().mockResolvedValue(true);

    const manager = new AutosaveQueueManager({
      attemptId: 101,
      saveFn: mockSave,
      initialOnline: false,
    });

    manager.enqueueAnswer(1, "choice_a");
    manager.enqueueAnswer(1, "choice_final");

    expect(manager.getQueue()).toHaveLength(1);
    expect(manager.getQueue()[0]).toEqual({ slot: 1, value: "choice_final" });
  });

  it("flushes offline queue and transitions to saved when returning online", async () => {
    const mockSave = vi.fn().mockResolvedValue(true);

    const manager = new AutosaveQueueManager({
      attemptId: 101,
      saveFn: mockSave,
      initialOnline: false,
    });

    manager.enqueueAnswer(1, "choice_a");
    manager.enqueueAnswer(2, "choice_c");

    expect(manager.getQueue()).toHaveLength(2);
    expect(mockSave).not.toHaveBeenCalled();

    // Reconnect to network
    manager.setOnline(true);
    await manager.flushQueue();

    // mockSave called with formatted payload
    expect(mockSave).toHaveBeenCalledTimes(1);
    expect(mockSave).toHaveBeenCalledWith({
      "q1:1_answer": "choice_a",
      "q2:1_answer": "choice_c",
    });

    // Queue is emptied and state becomes saved
    expect(manager.getQueue()).toHaveLength(0);
    expect(manager.getState()).toBe("saved");
  });
});
