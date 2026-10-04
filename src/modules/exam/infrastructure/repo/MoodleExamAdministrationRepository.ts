import { MoodleError } from "@/core/errors/MoodleError";
import type { MoodleClient } from "@/core/moodle/types";
import type { ExamAdministrationRepositoryInterface } from "../../domain/interfaces/ExamAdministrationRepositoryInterface";

export class MoodleExamAdministrationRepository
  implements ExamAdministrationRepositoryInterface
{
  async reorderQuizQuestions(
    client: MoodleClient,
    quizId: number,
    questions: Array<{ questionId: number; slot: number }>,
  ): Promise<void> {
    const res = await client.call<any>("local_examapi_reorder_quiz_questions", {
      quizid: quizId,
      questions: JSON.stringify(
        questions.map((q) => ({
          questionid: q.questionId,
          slot: q.slot,
        })),
      ),
    });

    if (res && res.error) {
      throw new MoodleError(`Failed to reorder quiz questions: ${res.error}`);
    }
  }
}
