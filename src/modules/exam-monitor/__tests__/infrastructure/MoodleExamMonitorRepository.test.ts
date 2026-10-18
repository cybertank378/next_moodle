import { describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleExamMonitorRepository } from "@/modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository";

describe("MoodleExamMonitorRepository", () => {
  it("fetches exam monitor snapshot and correctly maps counters and participants", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        quizid: 101,
        courseid: 202,
        name: "Ujian Akhir Matematika",
        counters: {
          total_enrolled: 40,
          not_started: 10,
          in_progress: 25,
          finished: 5,
          overdue: 0,
          locked: 2,
        },
        participants: [
          {
            userid: 1,
            fullname: "Student Alpha",
            attemptid: 501,
            attempt_number: 1,
            state: "inprogress",
            timestart: 1700000000,
            timefinish: 0,
            timeleft_seconds: 1800,
            currentpage: 3,
            is_locked: 0,
          },
          {
            userid: 2,
            fullname: "Student Beta",
            attemptid: 502,
            attempt_number: 1,
            state: "inprogress",
            timestart: 1700000000,
            timefinish: 0,
            timeleft_seconds: 600,
            currentpage: 5,
            is_locked: 1,
          },
        ],
        page: 1,
        limit: 50,
        total_pages: 1,
        timestamp: 1700001000,
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClientForUser: vi.fn(),
      createClient: vi.fn(),
    };

    const repo = new MoodleExamMonitorRepository(mockFactory);
    const result = await repo.getExamMonitor({
      tenantId: "tenant-1",
      quizId: 101,
    });

    expect(result.isSuccess).toBe(true);
    const data = result.getValue();
    expect(data.quizId).toBe(101);
    expect(data.totalActive).toBe(25);
    expect(data.totalFinished).toBe(5);
    expect(data.participants).toHaveLength(2);
    expect(data.participants[0].userId).toBe(1);
    expect(data.participants[0].timeRemaining).toBe(1800);
    expect(data.participants[0].isLocked).toBe(false);
    expect(data.participants[1].isLocked).toBe(true);

    expect(mockFactory.createClientForTenant).toHaveBeenCalledWith(
      expect.objectContaining({ tenantId: "tenant-1" }),
      "proctor",
    );
  });

  it("locks attempt passing required reason parameter to local_examapi_lock_attempt", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        attemptid: 501,
        status: "locked",
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClientForUser: vi.fn(),
      createClient: vi.fn(),
    };

    const repo = new MoodleExamMonitorRepository(mockFactory);
    const result = await repo.lockAttempt({
      tenantId: "tenant-1",
      attemptId: 501,
      reason: "Suspicious application window blur detected",
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_examapi_lock_attempt",
      {
        attemptid: 501,
        reason: "Suspicious application window blur detected",
      },
    );
  });

  it("unlocks attempt passing required reason parameter to local_examapi_unlock_attempt", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        attemptid: 501,
        status: "unlocked",
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClientForUser: vi.fn(),
      createClient: vi.fn(),
    };

    const repo = new MoodleExamMonitorRepository(mockFactory);
    const result = await repo.unlockAttempt({
      tenantId: "tenant-1",
      attemptId: 501,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_examapi_unlock_attempt",
      {
        attemptid: 501,
        reason: "Attempt unlocked by proctor",
      },
    );
  });

  it("force-finishes attempt passing required reason parameter to local_examapi_force_finish_attempt", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        attemptid: 501,
        status: "finished",
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClientForUser: vi.fn(),
      createClient: vi.fn(),
    };

    const repo = new MoodleExamMonitorRepository(mockFactory);
    const result = await repo.forceFinishAttempt({
      tenantId: "tenant-1",
      attemptId: 501,
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_examapi_force_finish_attempt",
      {
        attemptid: 501,
        reason: "Attempt force-finished by proctor",
      },
    );
  });

  it("extends attempt time passing extraminutes and reason to local_examapi_extend_attempt_time", async () => {
    const mockMoodleClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        attemptid: 501,
        new_timelimit: 3600,
      }),
    };

    const mockFactory: MoodleClientFactory = {
      createClientForTenant: vi.fn().mockResolvedValue(mockMoodleClient),
      createClientForUser: vi.fn(),
      createClient: vi.fn(),
    };

    const repo = new MoodleExamMonitorRepository(mockFactory);
    const result = await repo.extendAttemptTime({
      tenantId: "tenant-1",
      attemptId: 501,
      extraTimeMinutes: 15,
      reason: "Compensation for power interruption",
    });

    expect(result.isSuccess).toBe(true);
    expect(mockMoodleClient.call).toHaveBeenCalledWith(
      "local_examapi_extend_attempt_time",
      {
        attemptid: 501,
        extraminutes: 15,
        reason: "Compensation for power interruption",
      },
    );
  });
});
