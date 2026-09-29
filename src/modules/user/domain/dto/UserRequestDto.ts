export interface CreateUserRequestDto {
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  idnumber?: string;
  role?: "student" | "teacher" | "manager" | string;
  department?: string;
  institution?: string;
}

export interface UpdateUserRequestDto {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  idnumber?: string;
  suspended?: boolean;
}

export interface ListUsersQueryDto {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: string;
}

export interface BulkImportUsersRequestDto {
  csvContent?: string;
  defaultPassword?: string;
  users?: CreateUserRequestDto[];
}
