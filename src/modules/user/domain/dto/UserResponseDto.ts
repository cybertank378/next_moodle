export interface UserSummaryResponseDto {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  idnumber: string | null;
  department: string | null;
  institution: string | null;
  suspended: boolean;
  firstAccess: number | null;
  lastAccess: number | null;
  profileImageUrl: string | null;
}

export interface UserListResponseDto {
  users: UserSummaryResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UserImportRowErrorDto {
  row: number;
  error: string;
}

export interface BulkImportUsersResponseDto {
  importedCount: number;
  failedCount: number;
  createdUsers: Array<{
    id: number;
    username: string;
  }>;
  errors: UserImportRowErrorDto[];
}
