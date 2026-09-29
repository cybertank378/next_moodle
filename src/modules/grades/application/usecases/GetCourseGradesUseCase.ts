import type { GetCourseGradesRequestDto } from "../../domain/dto/GradeRequestDto";
import type { CourseGradesResponseDto } from "../../domain/dto/GradeResponseDto";
import type { GradeRepositoryInterface } from "../../domain/interfaces/GradeRepositoryInterface";
import { GradeMapper } from "../../domain/mapper/GradeMapper";
import { GradeAuthorizationService } from "../services/GradeAuthorizationService";

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
