import type { UserGradeReportEntity } from "../entity/GradeItemEntity";

export interface GradeRepositoryInterface {
  getUserGradeReport(
    tenantId: string,
    courseId: number,
    userId: number,
    studentMoodleToken?: string,
  ): Promise<UserGradeReportEntity>;

  getCourseGrades(
    tenantId: string,
    courseId: number,
    activityId?: number,
  ): Promise<UserGradeReportEntity[]>;
}
