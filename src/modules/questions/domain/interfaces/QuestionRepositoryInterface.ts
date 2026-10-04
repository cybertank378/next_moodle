import { MoodleClient } from "@/core/moodle/types";
import { QuestionEntity } from "../entity/QuestionEntity";
import { CreateQuestionRequestDto, UpdateQuestionRequestDto } from "../types/QuestionTypes";

export interface QuestionRepositoryInterface {
  getQuestionsByCategory(client: MoodleClient, categoryId: number): Promise<QuestionEntity[]>;
  createQuestion(client: MoodleClient, dto: CreateQuestionRequestDto): Promise<QuestionEntity>;
  updateQuestion(client: MoodleClient, questionId: number, dto: UpdateQuestionRequestDto): Promise<QuestionEntity>;
  deleteQuestion(client: MoodleClient, questionId: number): Promise<void>;
}
