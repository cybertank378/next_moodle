import "server-only";
import type { ILogger } from "@/core/logger";
import { moodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { TenantContext } from "@/core/tenant/TenantContext";
import { GetMyCoursesUseCase } from "@/modules/courses/application/usecases/GetMyCoursesUseCase";
import { MoodleCourseRepository } from "@/modules/courses/infrastructure/repositories/MoodleCourseRepository";

export async function createCourseDependencies(
  tenant: TenantContext,
  logger?: ILogger,
) {
  const moodleClient = await moodleClientFactory.getClientForTenant(
    tenant,
    logger,
  );
  const courseRepository = new MoodleCourseRepository(moodleClient);
  const getMyCoursesUseCase = new GetMyCoursesUseCase(courseRepository);

  return {
    courseRepository,
    getMyCoursesUseCase,
  };
}
