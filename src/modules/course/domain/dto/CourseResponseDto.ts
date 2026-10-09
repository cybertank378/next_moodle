export interface CourseSummaryResponseDTO {
  id: number;
  shortName: string;
  fullName: string;
  displayName: string;
  idNumber: string | null;
  summary: string;
  format: string;
  startDate: number | null;
  endDate: number | null;
  categoryId: number | null;
  progress: number | null;
  isCompleted: boolean;
  imageUrl: string | null;
}

export interface CourseModuleResponseDTO {
  id: number;
  name: string;
  instanceId: number | null;
  modName: string;
  url: string | null;
  isVisible: boolean;
  completionStatus: number | null;
}

export interface CourseSectionResponseDTO {
  id: number;
  name: string;
  sectionNumber: number;
  summary: string;
  isVisible: boolean;
  modules: CourseModuleResponseDTO[];
}

export interface CourseDetailResponseDTO {
  course: CourseSummaryResponseDTO;
  sections: CourseSectionResponseDTO[];
}

export interface CourseListResponseDTO {
  courses: CourseSummaryResponseDTO[];
  total: number;
}
