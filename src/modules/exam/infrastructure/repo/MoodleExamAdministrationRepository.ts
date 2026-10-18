import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClient } from "@/core/moodle/types";
import type { ExamAdministrationRepositoryInterface } from "@/modules/exam/domain/interfaces/ExamAdministrationRepositoryInterface";

export class MoodleExamAdministrationRepository
  implements ExamAdministrationRepositoryInterface
{
  async reorderQuizQuestions(
    client: MoodleClient,
    quizId: number,
    questions: Array<{ questionId: number; slot: number }>,
  ): Promise<void> {
    const sortedSlotIds = questions
      .slice()
      .sort((a, b) => a.slot - b.slot)
      .map((q) => q.slot);

    const res = await client.call<{
      success?: boolean;
      quizid?: number;
      error?: string;
    }>("local_examapi_reorder_quiz_questions", {
      quizid: quizId,
      slotids_json: JSON.stringify(sortedSlotIds),
    });

    if (res?.error) {
      throw new MoodleError(
        "REORDER_FAILED",
        `Failed to reorder quiz questions: ${res.error}`,
      );
    }
  }
}
