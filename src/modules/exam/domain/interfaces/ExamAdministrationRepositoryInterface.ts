import type { MoodleClient } from "@/core/moodle/types";

export interface ExamAdministrationRepositoryInterface {
  reorderQuizQuestions(
    client: MoodleClient,
    quizId: number,
    questions: Array<{ questionId: number; slot: number }>,
  ): Promise<void>;
  // Other methods like addQuestionToQuiz, removeQuestionFromQuiz can be added here
}
