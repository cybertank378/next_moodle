import type { GetUserGradesRequestDto } from "../../domain/dto/GradeRequestDto";
import type { UserGradeReportResponseDto } from "../../domain/dto/GradeResponseDto";
import type { GradeRepositoryInterface } from "../../domain/interfaces/GradeRepositoryInterface";
import { GradeMapper } from "../../domain/mapper/GradeMapper";
import { GradeAuthorizationService } from "../services/GradeAuthorizationService";

export class GetUserGradesUseCase {
  constructor(private readonly gradeRepository: GradeRepositoryInterface) {}

  async execute(
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
