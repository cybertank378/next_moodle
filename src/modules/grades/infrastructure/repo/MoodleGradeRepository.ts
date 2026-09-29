import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import { UserGradeReportEntity } from "../../domain/entity/GradeItemEntity";
import type { GradeRepositoryInterface } from "../../domain/interfaces/GradeRepositoryInterface";
import { GradeMapper } from "../../domain/mapper/GradeMapper";
import type {
  RawMoodleCoreGradesResponse,
  RawMoodleGradeReportResponse,
} from "../../domain/types/GradeTypes";

export class MoodleGradeRepository implements GradeRepositoryInterface {
  constructor(
    private readonly clientFactory: MoodleClientFactory,
    private readonly clientOverride?: MoodleClient,
  ) {}

  private async resolveClient(
    tenantId: string,
    studentMoodleToken?: string,
  ): Promise<MoodleClient> {
    if (this.clientOverride) return this.clientOverride;

    if (studentMoodleToken) {
      try {
        const tenantClient = await this.clientFactory.createClientForTenant(
          { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
          "admin",
        );
        if (typeof this.clientFactory.createClient === "function") {
          return this.clientFactory.createClient({
            baseUrl:
              (
                tenantClient as unknown as { endpoint?: string }
              ).endpoint?.replace(/\/webservice\/rest\/server\.php.*$/, "") ||
              "http://localhost:8080",
            token: studentMoodleToken,
          });
        }
        return tenantClient;
      } catch {
        if (typeof this.clientFactory.createClient === "function") {
          return this.clientFactory.createClient({
            baseUrl: "http://localhost:8080",
            token: studentMoodleToken,
          });
        }
      }
    }

    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async getUserGradeReport(
    tenantId: string,
    courseId: number,
    userId: number,
    studentMoodleToken?: string,
  ): Promise<UserGradeReportEntity> {
    const client = await this.resolveClient(tenantId, studentMoodleToken);

    try {
      const response = await client.call<RawMoodleGradeReportResponse>(
        "gradereport_user_get_grade_items",
        {
          courseid: courseId,
          userid: userId,
        },
      );

      const userGrade =
        response.usergrades?.find((u) => u.userid === userId) ??
        response.usergrades?.[0];
      if (userGrade) {
        return GradeMapper.toUserReportEntity(userGrade);
      }
    } catch {
      // Fallback to core_grades_get_grades if gradereport_user_get_grade_items is unavailable
    }

    // Fallback: core_grades_get_grades
    const coreResponse = await client.call<RawMoodleCoreGradesResponse>(
      "core_grades_get_grades",
      {
        courseid: courseId,
        userids: [userId],
      },
    );

    const reports = GradeMapper.fromCoreGradesToReportEntities(
      courseId,
      coreResponse,
    );
    const userReport = reports.find((r) => r.userId === userId);
    if (userReport) {
      return userReport;
    }

    return new UserGradeReportEntity({
      courseId,
      userId,
      userFullName: `Peserta #${userId}`,
      items: [],
      courseTotal: null,
    });
  }

  async getCourseGrades(
    tenantId: string,
    courseId: number,
    activityId?: number,
  ): Promise<UserGradeReportEntity[]> {
    const client = await this.resolveClient(tenantId);

    const params: Record<string, unknown> = {
      courseid: courseId,
    };
    if (activityId) {
      params.activityid = activityId;
    }

    const response = await client.call<RawMoodleCoreGradesResponse>(
      "core_grades_get_grades",
      params,
    );

    return GradeMapper.fromCoreGradesToReportEntities(courseId, response);
  }
}
