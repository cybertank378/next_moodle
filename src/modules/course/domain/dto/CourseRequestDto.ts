export interface GetCourseListRequestDTO {
  search?: string;
  categoryId?: number;
  page?: number;
  pageSize?: number;
}

export interface GetCourseDetailRequestDTO {
  courseId: number;
}
