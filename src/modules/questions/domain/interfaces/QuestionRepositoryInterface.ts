import type { MoodleClient } from "@/core/moodle/types";
import type { QuestionEntity } from "@/modules/questions/domain/entity/QuestionEntity";
import type {
  CreateQuestionCategoryRequestDto,
  CreateQuestionRequestDto,
  GetQuestionsQueryDto,
  GetQuestionsResultDto,
  QuestionCategory,
  UpdateQuestionRequestDto,
} from "@/modules/questions/domain/types/QuestionTypes";

export interface GetQuestionsRepoInput {
  tenantId: string;
  params: GetQuestionsQueryDto;
  client?: MoodleClient;
}

export interface GetQuestionCategoriesRepoInput {
  tenantId: string;
  contextId: number;
  client?: MoodleClient;
}

export interface CreateQuestionCategoryRepoInput {
  tenantId: string;
  dto: CreateQuestionCategoryRequestDto;
  client?: MoodleClient;
}

export interface QuestionRepositoryInterface {
  getQuestionsByCategory(
    client: MoodleClient,
    categoryId: number,
  ): Promise<QuestionEntity[]>;

  getQuestions(
    clientOrInput: MoodleClient | GetQuestionsRepoInput,
    params?: GetQuestionsQueryDto,
  ): Promise<GetQuestionsResultDto>;

  getQuestionCategories(
    clientOrInput: MoodleClient | GetQuestionCategoriesRepoInput,
    contextId?: number,
  ): Promise<QuestionCategory[]>;

  createQuestionCategory(
    clientOrInput: MoodleClient | CreateQuestionCategoryRepoInput,
    dto?: CreateQuestionCategoryRequestDto,
  ): Promise<QuestionCategory>;

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
