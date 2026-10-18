import type { MoodleClient } from "@/core/moodle/types";

export interface QuizQuestionSlot {
  id: number;
  quizId: number;
  slot: number;
  page: number;
  questionId: number;
  questionName: string;
  qtype: string;
  maxMark: number;
  isRandom: boolean;
}

export interface ReorderQuizQuestionsInput {
  tenantId: string;
  quizId: number;
  questions: Array<{ questionId: number; slot: number }>;
  client?: MoodleClient;
}

export interface AddQuestionToQuizRepoInput {
  tenantId: string;
  quizId: number;
  questionId: number;
  maxMark?: number;
  page?: number;
  client?: MoodleClient;
}

export interface AddRandomQuestionsRepoInput {
  tenantId: string;
  quizId: number;
  categoryId: number;
  randomCount?: number;
  includeSubcategories?: boolean;
  client?: MoodleClient;
}

export interface GetQuizQuestionsRepoInput {
  tenantId: string;
  quizId: number;
  client?: MoodleClient;
}

export interface ExamAdministrationRepositoryInterface {
  reorderQuizQuestions(
    inputOrClient: ReorderQuizQuestionsInput | MoodleClient,
    quizId?: number,
    questions?: Array<{ questionId: number; slot: number }>,
  ): Promise<void>;

  addQuestionToQuiz(
    input: AddQuestionToQuizRepoInput,
  ): Promise<{ id: number; slot: number; page: number }>;

  addRandomQuestions(
    input: AddRandomQuestionsRepoInput,
  ): Promise<void>;

  getQuizQuestions(
    input: GetQuizQuestionsRepoInput,
  ): Promise<QuizQuestionSlot[]>;
}
