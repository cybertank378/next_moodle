export interface EnrolUserRequestDto {
  courseId: number;
  userId: number;
  roleId?: number; // 5 = student, 3 = editingteacher, 4 = teacher
  timestart?: number;
  timeend?: number;
}

export interface UnenrolUserRequestDto {
  courseId: number;
  userId: number;
  roleId?: number;
}

export interface ListEnrolmentsQueryDto {
  courseId: number;
  search?: string;
  page?: number;
  pageSize?: number;
}
