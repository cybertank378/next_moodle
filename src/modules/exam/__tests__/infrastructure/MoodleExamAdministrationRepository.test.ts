import { describe, expect, it, vi } from "vitest";
import type { MoodleClient } from "@/core/moodle/types";
import { MoodleExamAdministrationRepository } from "@/modules/exam/infrastructure/repo/MoodleExamAdministrationRepository";

describe("MoodleExamAdministrationRepository", () => {
  it("reorders quiz questions by passing slotids_json as JSON array of slot IDs", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: true,
        quizid: 10,
      }),
    };

    const repo = new MoodleExamAdministrationRepository();
    await repo.reorderQuizQuestions(mockClient, 10, [
      { questionId: 102, slot: 2 },
      { questionId: 101, slot: 1 },
      { questionId: 103, slot: 3 },
    ]);

    expect(mockClient.call).toHaveBeenCalledWith(
      "local_examapi_reorder_quiz_questions",
      {
        quizid: 10,
        slotids_json: JSON.stringify([1, 2, 3]),
      },
    );
  });

  it("throws MoodleError when upstream returns an error field", async () => {
    const mockClient: MoodleClient = {
      call: vi.fn().mockResolvedValue({
        success: false,
        error: "Quiz locked",
      }),
    };

    const repo = new MoodleExamAdministrationRepository();
    await expect(
      repo.reorderQuizQuestions(mockClient, 10, [{ questionId: 101, slot: 1 }]),
    ).rejects.toThrow("Failed to reorder quiz questions: Quiz locked");
  });
});
