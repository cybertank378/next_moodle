import { BaseUseCase } from "@/core/base/BaseUseCase";
import { GradeAuthorizationService } from "@/modules/grades/application/services/GradeAuthorizationService";
import type { GetUserGradesRequestDto } from "@/modules/grades/domain/dto/GradeRequestDto";
import type { UserGradeReportResponseDto } from "@/modules/grades/domain/dto/GradeResponseDto";
import type { GradeRepositoryInterface } from "@/modules/grades/domain/interfaces/GradeRepositoryInterface";
import { GradeMapper } from "@/modules/grades/domain/mapper/GradeMapper";

export class GetUserGradesUseCase extends BaseUseCase<
  GetUserGradesRequestDto,
  UserGradeReportResponseDto
> {
  constructor(private readonly gradeRepository: GradeRepositoryInterface) {
    super();
  }

  async handle(
    dto: GetUserGradesRequestDto,
  ): Promise<UserGradeReportResponseDto> {
    const { tenantId, resolvedUserId } =
      GradeAuthorizationService.authorizeUserGradesAccess(
        dto.actor,
        dto.userId,
      );

    const reportEntity = await this.gradeRepository.getUserGradeReport(
      tenantId,
      dto.courseId,
      resolvedUserId,
      dto.studentMoodleToken,
    );

    return GradeMapper.toUserReportDto(reportEntity);
  }
}
