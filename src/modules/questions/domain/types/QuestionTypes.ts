// Files: src/modules/questions/domain/types/QuestionTypes.ts

export enum QuestionType {
  MULTICHOICE = "multichoice",
  TRUEFALSE = "truefalse",
  ESSAY = "essay",
  SHORTANSWER = "shortanswer",
}

export interface QuestionOption {
  text: string;
  fraction: number; // 0 to 100
  feedback?: string;
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
