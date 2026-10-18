// Files: src/modules/questions/domain/types/QuestionTypes.ts

export enum QuestionType {
  MULTICHOICE = "multichoice",
  TRUEFALSE = "truefalse",
  ESSAY = "essay",
  SHORTANSWER = "shortanswer",
  MATCH = "match",
  NUMERICAL = "numerical",
}

export interface QuestionOption {
  text: string;
  fraction: number; // 0 to 100
  feedback?: string;
}

export interface QuestionCategory {
  id: number;
  name: string;
  contextId: number;
  parent: number;
  info?: string;
  questionCount: number;
}

export interface CreateQuestionCategoryRequestDto {
  name: string;
  contextId: number;
  parent?: number;
  info?: string;
}

export interface CreateQuestionRequestDto {
  categoryId: number;
  name: string;
  questionText: string;
  type: QuestionType;
  defaultMark: number;
  options?: QuestionOption[];
}

export interface UpdateQuestionRequestDto {
  name?: string;
  questionText?: string;
  defaultMark?: number;
  options?: QuestionOption[];
}

export interface GetQuestionsQueryDto {
  categoryId?: number;
  qtype?: string;
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface GetQuestionsResultDto {
  total: number;
  page: number;
  limit: number;
  questions: Array<{
    id: number;
    categoryId: number;
    type: QuestionType | string;
    name: string;
    questionText: string;
    defaultMark: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
}
