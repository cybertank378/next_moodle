import { beforeEach, describe, expect, it, vi } from "vitest";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleQuizAttemptRepository } from "../../infrastructure/repo/MoodleQuizAttemptRepository";

describe("MoodleQuizAttemptRepository", () => {
  let mockClient: MoodleClient;
  let mockFactory: MoodleClientFactory;

  beforeEach(() => {
    mockClient = {
      call: vi.fn(),
    };

    mockFactory = {
      createClient: vi.fn().mockReturnValue(mockClient as never),
      createClientForTenant: vi.fn().mockResolvedValue(mockClient as never),
    };
  });

  it("starts attempt via mod_quiz_start_attempt", async () => {
    vi.mocked(mockClient.call).mockResolvedValue({
      attempt: {
        id: 701,
        quiz: 15,
        userid: 33,
        attempt: 1,
        state: "inprogress",
        timestart: 1700000000,
        timefinish: 0,
        timemodified: 1700000000,
        currentpage: 0,
      },
    });

    const repo = new MoodleQuizAttemptRepository(mockFactory, mockClient);
    const attempt = await repo.startAttempt(
      "tenant-alpha",
      "student-token-123",
      15,
      false,
      "student-uuid-33",
    );

    expect(attempt.id).toBe(701);
    expect(attempt.quizId).toBe(15);
    expect(attempt.state).toBe("IN_PROGRESS");
    expect(mockClient.call).toHaveBeenCalledWith("mod_quiz_start_attempt", {
      quizid: 15,
      forcenew: 0,
    });
  });

  it("fetches user attempts via mod_quiz_get_user_attempts", async () => {
    vi.mocked(mockClient.call).mockResolvedValue({
      attempts: [
        {
          id: 801,
          quiz: 20,
          userid: 33,
          attempt: 1,
          state: "finished",
          sumgrades: 90,
          timestart: 1700000000,
          timefinish: 1700003600,
          timemodified: 1700003600,
          currentpage: 0,
        },
      ],
    });

    const repo = new MoodleQuizAttemptRepository(mockFactory, mockClient);
    const attempts = await repo.getUserAttempts(
      "tenant-alpha",
      "student-token-123",
      20,
      33,
      "all",
      "student-uuid-33",
    );

    expect(attempts).toHaveLength(1);
    expect(attempts[0].id).toBe(801);
    expect(attempts[0].state).toBe("FINISHED");
    expect(mockClient.call).toHaveBeenCalledWith("mod_quiz_get_user_attempts", {
      quizid: 20,
      userid: 33,
      status: "all",
      includepreviews: 0,
    });
  });

  it("saves attempt via mod_quiz_save_attempt", async () => {
    vi.mocked(mockClient.call).mockResolvedValue({
      status: true,
    });

    const repo = new MoodleQuizAttemptRepository(mockFactory, mockClient);
    const status = await repo.saveAttempt(
      "tenant-alpha",
      "student-token-123",
      701,
      [{ name: "q1:1_answer", value: "option_a" }],
    );

    expect(status).toBe(true);
    expect(mockClient.call).toHaveBeenCalledWith("mod_quiz_save_attempt", {
      attemptid: 701,
      data: [{ name: "q1:1_answer", value: "option_a" }],
    });
  });

  it("processes attempt final submit via mod_quiz_process_attempt", async () => {
    vi.mocked(mockClient.call).mockResolvedValue({
      state: "finished",
    });

    const repo = new MoodleQuizAttemptRepository(mockFactory, mockClient);
    const result = await repo.processAttempt(
      "tenant-alpha",
      "student-token-123",
      701,
      [],
      true,
      false,
    );

    expect(result.state).toBe("FINISHED");
    expect(mockClient.call).toHaveBeenCalledWith("mod_quiz_process_attempt", {
      attemptid: 701,
      data: [],
      finishattempt: 1,
      timeup: 0,
    });
  });

  it("gets attempt data via mod_quiz_get_attempt_data", async () => {
    vi.mocked(mockClient.call).mockResolvedValue({
      attempt: {
        id: 701,
        quiz: 15,
        userid: 33,
        attempt: 1,
        state: "inprogress",
        timestart: 1700000000,
        timefinish: 0,
        timemodified: 1700000000,
        currentpage: 0,
      },
      questions: [
        {
          slot: 1,
          type: "multichoice",
          page: 0,
          html: "<p>Q1</p>",
          number: 1,
        },
      ],
      nextpage: 1,
    });

    const repo = new MoodleQuizAttemptRepository(mockFactory, mockClient);
    const data = await repo.getAttemptData(
      "tenant-alpha",
      "student-token-123",
      701,
      0,
      "student-uuid-33",
    );

    expect(data.attempt.id).toBe(701);
    expect(data.questions).toHaveLength(1);
    expect(data.nextPage).toBe(1);
  });
});
