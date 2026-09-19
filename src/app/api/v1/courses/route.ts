import { withApiHandler } from "@/core/http/withApiHandler";
import { createCourseDependencies } from "@/modules/courses/infrastructure/factories/createCourseDependencies";

export const GET = withApiHandler(
  async (_request, context) => {
    const { getMyCoursesUseCase } = await createCourseDependencies(context.tenant, context.logger);

    const courses = await getMyCoursesUseCase.execute(context.actor);
    return courses;
  },
  { requireAuth: false }, // allows demo / fallback actor in development
);
