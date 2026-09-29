export interface EnrolmentRoleDto {
  roleId: number;
  name: string;
  shortname: string;
}

export interface EnrolledUserResponseDto {
  id: number;
  userId: number;
  courseId: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  idnumber: string | null;
  department: string | null;
  roles: EnrolmentRoleDto[];
  timestart: number | null;
  timeend: number | null;
  profileImageUrl: string | null;
}

export interface EnrolmentListResponseDto {
  enrolments: EnrolledUserResponseDto[];
  total: number;
  page: number;
  pageSize: number;
}
