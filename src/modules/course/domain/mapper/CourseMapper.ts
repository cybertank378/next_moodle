import type {
  CourseModuleResponseDTO,
  CourseSectionResponseDTO,
  CourseSummaryResponseDTO,
} from "@/modules/course/domain/dto/CourseResponseDto";
import { CourseEntity } from "@/modules/course/domain/entity/CourseEntity";
import type {
  RawMoodleCourse,
  RawMoodleModule,
  RawMoodleSection,
} from "@/modules/course/domain/types/CourseTypes";

export class CourseMapper {
  public static toEntity(raw: RawMoodleCourse, tenantId: string): CourseEntity {
    const overviewImage = raw.overviewfiles?.find((file) =>
      file.mimetype?.startsWith("image/"),
    );

    return new CourseEntity(raw.id, tenantId, {
      id: raw.id,
      shortName: raw.shortname,
      fullName: raw.fullname,
      displayName: raw.displayname || raw.fullname,
      idNumber: raw.idnumber,
      summary: raw.summary ?? "",
      format: raw.format ?? "topics",
      startDate: raw.startdate,
      endDate: raw.enddate,
      categoryId: raw.category,
      progress: raw.progress ?? null,
      isCompleted: Boolean(raw.completed),
      imageUrl: overviewImage?.fileurl ?? null,
    });
  }

  public static toSummaryDTO(entity: CourseEntity): CourseSummaryResponseDTO {
    return {
      id: entity.id,
      shortName: entity.shortName,
      fullName: entity.fullName,
      displayName: entity.displayName,
      idNumber: entity.idNumber,
      summary: entity.summary,
      format: entity.format,
      startDate: entity.startDate,
      endDate: entity.endDate,
      categoryId: entity.categoryId,
      progress: entity.progress,
      isCompleted: entity.isCompleted,
      imageUrl: entity.imageUrl,
    };
  }

  public static toModuleDTO(raw: RawMoodleModule): CourseModuleResponseDTO {
    return {
      id: raw.id,
      name: raw.name,
      instanceId: raw.instance ?? null,
      modName: raw.modname,
      url: raw.url ?? null,
      isVisible: raw.visible !== 0 && raw.uservisible !== false,
      completionStatus: raw.completion ?? null,
    };
  }

  public static toSectionDTO(raw: RawMoodleSection): CourseSectionResponseDTO {
    return {
      id: raw.id,
      name: raw.name || `Topik ${raw.section ?? raw.id}`,
      sectionNumber: raw.section ?? 0,
      summary: raw.summary ?? "",
      isVisible: raw.visible !== 0,
      modules: (raw.modules ?? []).map(CourseMapper.toModuleDTO),
    };
  }
}
