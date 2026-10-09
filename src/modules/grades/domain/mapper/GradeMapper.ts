import type {
  CourseGradesResponseDto,
  GradeItemResponseDto,
  UserGradeReportResponseDto,
} from "@/modules/grades/domain/dto/GradeResponseDto";
import {
  GradeItemEntity,
  UserGradeReportEntity,
} from "@/modules/grades/domain/entity/GradeItemEntity";
import type {
  RawMoodleCoreGradesResponse,
  RawMoodleGradeItem,
  RawMoodleUserGrade,
} from "@/modules/grades/domain/types/GradeTypes";

export class GradeMapper {
  public static toItemEntity(raw: RawMoodleGradeItem): GradeItemEntity {
    return new GradeItemEntity({
      id: raw.id,
      itemName:
        raw.itemname ||
        (raw.itemtype === "course" ? "Total Mata Pelajaran" : "Penilaian"),
      itemType: raw.itemtype,
      itemModule: raw.itemmodule ?? null,
      itemInstance: raw.iteminstance ?? null,
      gradeRaw:
        raw.graderaw !== undefined && raw.graderaw !== null
          ? Number(raw.graderaw)
          : null,
      gradeFormatted: raw.gradeformatted?.trim() || "-",
      gradeMin:
        raw.grademin !== undefined && raw.grademin !== null
          ? Number(raw.grademin)
          : 0,
      gradeMax:
        raw.grademax !== undefined && raw.grademax !== null
          ? Number(raw.grademax)
          : 100,
      gradePass:
        raw.gradepass !== undefined && raw.gradepass !== null
          ? Number(raw.gradepass)
          : null,
      percentageFormatted: raw.percentageformatted?.trim() || null,
      feedback: raw.feedback?.trim() || null,
    });
  }

  public static toUserReportEntity(
    raw: RawMoodleUserGrade,
  ): UserGradeReportEntity {
    const rawItems = raw.gradeitems ?? [];
    const allEntities = rawItems.map((item) => GradeMapper.toItemEntity(item));

    const courseTotal = allEntities.find((e) => e.isCourseTotal()) ?? null;
    const items = allEntities.filter((e) => !e.isCourseTotal());

    return new UserGradeReportEntity({
      courseId: raw.courseid,
      userId: raw.userid,
      userFullName: raw.userfullname || `Peserta #${raw.userid}`,
      items,
      courseTotal,
    });
  }

  public static toItemDto(entity: GradeItemEntity): GradeItemResponseDto {
    return {
      id: entity.id,
      itemName: entity.itemName,
      itemType: entity.itemType,
      itemModule: entity.itemModule,
      itemInstance: entity.itemInstance,
      gradeRaw: entity.gradeRaw,
      gradeFormatted: entity.gradeFormatted,
      gradeMin: entity.gradeMin,
      gradeMax: entity.gradeMax,
      gradePass: entity.gradePass,
      percentageFormatted: entity.percentageFormatted,
      feedback: entity.feedback,
      isPassed: entity.isPassed,
    };
  }

  public static toUserReportDto(
    entity: UserGradeReportEntity,
  ): UserGradeReportResponseDto {
    return {
      courseId: entity.courseId,
      userId: entity.userId,
      userFullName: entity.userFullName,
      items: entity.items.map((item) => GradeMapper.toItemDto(item)),
      courseTotal: entity.courseTotal
        ? GradeMapper.toItemDto(entity.courseTotal)
        : null,
    };
  }

  public static toCourseGradesDto(
    courseId: number,
    reports: UserGradeReportEntity[],
  ): CourseGradesResponseDto {
    return {
      courseId,
      reports: reports.map((r) => GradeMapper.toUserReportDto(r)),
    };
  }

  public static fromCoreGradesToReportEntities(
    courseId: number,
    rawCore: RawMoodleCoreGradesResponse,
  ): UserGradeReportEntity[] {
    const items = rawCore.items ?? [];
    const userMap = new Map<number, GradeItemEntity[]>();

    for (const item of items) {
      const grades = item.grades ?? [];
      for (const g of grades) {
        if (!userMap.has(g.userid)) {
          userMap.set(g.userid, []);
        }
        const entity = new GradeItemEntity({
          id: g.id,
          itemName: item.name || "Penilaian",
          itemType: item.name?.toLowerCase().includes("course total")
            ? "course"
            : "mod",
          itemModule: "quiz",
          itemInstance: item.activityid ? Number(item.activityid) : null,
          gradeRaw:
            g.grade !== undefined && g.grade !== null ? Number(g.grade) : null,
          gradeFormatted:
            g.str_grade ||
            (g.grade !== null && g.grade !== undefined ? String(g.grade) : "-"),
          gradeMin: 0,
          gradeMax: 100,
          gradePass: null,
          percentageFormatted: null,
          feedback: g.feedback ?? null,
        });
        userMap.get(g.userid)?.push(entity);
      }
    }

    const reports: UserGradeReportEntity[] = [];
    for (const [userId, entities] of userMap.entries()) {
      const courseTotal = entities.find((e) => e.isCourseTotal()) ?? null;
      const subItems = entities.filter((e) => !e.isCourseTotal());
      reports.push(
        new UserGradeReportEntity({
          courseId,
          userId,
          userFullName: `Peserta #${userId}`,
          items: subItems,
          courseTotal,
        }),
      );
    }

    return reports;
  }
}
