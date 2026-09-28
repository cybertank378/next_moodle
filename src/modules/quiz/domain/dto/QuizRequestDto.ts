export interface ListQuizzesQueryDTO {
  courseId?: number;
  search?: string;
}

export interface CheckQuizAccessRequestDTO {
  quizId: number;
}
