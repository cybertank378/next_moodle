import type { QuizAccessResponseDTO } from "../dto";
import type { Quiz } from "../entities/Quiz";

export interface QuizRepository {
  getQuizzesByCourse(
    courseId: string,
    tenantId: string,
  ): Promise<readonly Quiz[]>;
  getQuizById(quizId: string, tenantId: string): Promise<Quiz | null>;
  getQuizAccess(
    quizId: string,
    actorId: string,
    tenantId: string,
  ): Promise<QuizAccessResponseDTO>;
}
