import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type {
  CreateQuestionRequestDto,
  UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export interface QuestionRepositoryInterface {
  getQuestionsByCategory(
    client: MoodleClient,
    categoryId: number,
  ): Promise<QuestionEntity[]>;
  createQuestion(
    client: MoodleClient,
    dto: CreateQuestionRequestDto,
  ): Promise<QuestionEntity>;
  updateQuestion(
    client: MoodleClient,
    questionId: number,
    dto: UpdateQuestionRequestDto,
  ): Promise<QuestionEntity>;
  deleteQuestion(client: MoodleClient, questionId: number): Promise<void>;
}
