import { GradeAuthorizationService } from "@/modules/grades/application/services/GradeAuthorizationService";
import type { GetCourseGradesRequestDto } from "@/modules/grades/domain/dto/GradeRequestDto";
import type { CourseGradesResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";
import { GradeMapper } from "@/modules/grades/domain/mapper/GradeMapper";

export class GetCourseGradesUseCase {
  constructor(private readonly gradeRepository: GradeRepositoryInterface) {}

  async execute(
    dto: GetCourseGradesRequestDto,
  ): Promise<CourseGradesResponseDto> {
    const { tenantId } = GradeAuthorizationService.authorizeCourseGradesAccess(
      dto.actor,
    );

    const reportEntities = await this.gradeRepository.getCourseGrades(
      tenantId,
      dto.courseId,
      dto.activityId,
    );

    return GradeMapper.toCourseGradesDto(dto.courseId, reportEntities);
  }
}
