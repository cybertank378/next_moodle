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
