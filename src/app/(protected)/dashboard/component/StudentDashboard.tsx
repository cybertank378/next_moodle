import "server-only";
import { getStudentDashboardUseCase } from "@/app/api/dashboard/_factory";
import { AppRole } from "@/core/rbac/AppRole";
import type { StudentDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import { getCurrentSession } from "@/modules/auth/server/getCurrentSession";
import StudentDashboardPage from "@/sections/dashboard/pages/StudentDashboardPage";

export default async function StudentDashboard() {
  let initialData: StudentDashboardResponseDto | null = null;

  try {
    const session = await getCurrentSession();
    if (
      session &&
      session.actor.role === AppRole.STUDENT &&
      session.actor.tenantId &&
      session.actor.moodleUserId
    ) {
      const useCase = getStudentDashboardUseCase();
      const result = await useCase.execute({
        actor: {
          id: session.actor.userId,
          role: session.actor.role,
          tenantId: session.actor.tenantId,
          moodleUserId: session.actor.moodleUserId,
          displayName: session.actor.displayName,
        },
        moodleToken: session.moodleToken,
      });

      if (result.isSuccess) {
        initialData = result.getValue();
      }
    }
  } catch (_e) {
    // Graceful fallback to client fetching if server loader encounters an error
  }

  return <StudentDashboardPage initialData={initialData} />;
}

