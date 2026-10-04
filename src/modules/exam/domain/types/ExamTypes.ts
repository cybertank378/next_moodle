export interface ReorderQuizQuestionsRequestDto {
  quizId: number;
  questions: Array<{
    questionId: number;
    slot: number;
  }>;
}
