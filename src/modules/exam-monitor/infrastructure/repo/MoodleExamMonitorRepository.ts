import { Result } from "@/core/base/Result";
import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type {
  ExamMonitorActionRequestDto,
  ExamMonitorRequestDto,
  ExamMonitorResponseDto,
  ExtendAttemptTimeRequestDto,
} from "@/modules/exam-monitor/domain/dto/ExamMonitorDto";
import type { ExamMonitorRepositoryInterface } from "@/modules/exam-monitor/domain/interfaces/ExamMonitorRepositoryInterface";
import { ExamMonitorMapper } from "@/modules/exam-monitor/domain/mapper/ExamMonitorMapper";

export class MoodleExamMonitorRepository
  implements ExamMonitorRepositoryInterface
{
  constructor(private readonly moodleClientFactory: MoodleClientFactory) {}

  private handleError(error: unknown): Result<any> {
    return Result.failure(
      error instanceof Error ? error : new Error(String(error)),
    );
  }

  async getExamMonitor(
    req: ExamMonitorRequestDto,
  ): Promise<Result<ExamMonitorResponseDto>> {
    try {
      const client = await this.moodleClientFactory.createClientForTenant(
        { tenantId: req.tenantId, tenantSlug: req.tenantId, status: "ACTIVE" },
        "proctor",
      );

      const response = await client.call<{
        quizid: number;
        participants: Array<{
          attemptid: number;
          userid: number;
          fullname: string;
          state: string;
          timecreated: number;
          timemodified: number;
          timelimit: number;
          timeremaining?: number;
          islocked: boolean;
        }>;
        totalactive: number;
        totalfinished: number;
      }>("local_examapi_get_exam_monitor", {
        quizid: req.quizId,
      });

      return Result.success(ExamMonitorMapper.toResponseDto(response));
    } catch (error) {
      return this.handleError(error);
    }
  }

  async lockAttempt(req: ExamMonitorActionRequestDto): Promise<Result<void>> {
    try {
      const client = await this.moodleClientFactory.createClientForTenant(
        { tenantId: req.tenantId, tenantSlug: req.tenantId, status: "ACTIVE" },
        "proctor",
      );

      await client.call("local_examapi_lock_attempt", {
        attemptid: req.attemptId,
      });

      return Result.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async unlockAttempt(req: ExamMonitorActionRequestDto): Promise<Result<void>> {
    try {
      const client = await this.moodleClientFactory.createClientForTenant(
        { tenantId: req.tenantId, tenantSlug: req.tenantId, status: "ACTIVE" },
        "proctor",
      );

      await client.call("local_examapi_unlock_attempt", {
        attemptid: req.attemptId,
      });

      return Result.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async forceFinishAttempt(
    req: ExamMonitorActionRequestDto,
  ): Promise<Result<void>> {
    try {
      const client = await this.moodleClientFactory.createClientForTenant(
        { tenantId: req.tenantId, tenantSlug: req.tenantId, status: "ACTIVE" },
        "proctor",
      );

      await client.call("local_examapi_force_finish_attempt", {
        attemptid: req.attemptId,
      });

      return Result.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }

  async extendAttemptTime(
    req: ExtendAttemptTimeRequestDto,
  ): Promise<Result<void>> {
    try {
      const client = await this.moodleClientFactory.createClientForTenant(
        { tenantId: req.tenantId, tenantSlug: req.tenantId, status: "ACTIVE" },
        "proctor",
      );

      await client.call("local_examapi_extend_attempt_time", {
        attemptid: req.attemptId,
        extratimeminutes: req.extraTimeMinutes,
      });

      return Result.success(undefined);
    } catch (error) {
      return this.handleError(error);
    }
  }
}
