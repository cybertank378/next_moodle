import type { MoodleClient } from "@/core/moodle/types";
import type { QuizEntity } from "@/modules/quiz/domain/entity/QuizEntity";
import type { RawMoodleQuizAccessInfo } from "@/modules/quiz/domain/types/QuizTypes";

export interface QuizRepositoryInterface {
  getQuizzesByCourses(input: {
    tenantId: string;
    courseIds: number[];
    client?: MoodleClient;
  }): Promise<QuizEntity[]>;

  getQuizById(input: {
    tenantId: string;
    quizId: number;
    courseId?: number;
    client?: MoodleClient;
  }): Promise<QuizEntity | null>;

  getQuizAccessInfo(input: {
    tenantId: string;
    quizId: number;
    client?: MoodleClient;
  }): Promise<RawMoodleQuizAccessInfo | null>;
}
