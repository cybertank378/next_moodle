export interface GradeItemResponseDto {
  id: number;
  itemName: string;
  itemType: string;
  itemModule: string | null;
  itemInstance: number | null;
  gradeRaw: number | null;
  gradeFormatted: string;
  gradeMin: number;
  gradeMax: number;
  gradePass: number | null;
  percentageFormatted: string | null;
  feedback: string | null;
  isPassed: boolean | null;
}

export interface UserGradeReportResponseDto {
  courseId: number;
  userId: number;
  userFullName: string;
  items: GradeItemResponseDto[];
  courseTotal: GradeItemResponseDto | null;
}

export interface CourseGradesResponseDto {
  courseId: number;
  reports: UserGradeReportResponseDto[];
}
