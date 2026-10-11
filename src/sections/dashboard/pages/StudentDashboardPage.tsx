import type { StudentDashboardResponseDto } from "@/modules/dashboard/domain/dto/DashboardResponseDto";
import StudentDashboardOverview from "@/sections/dashboard/organisms/StudentDashboardOverview";

export default function StudentDashboardPage({
  initialData,
}: {
  initialData?: StudentDashboardResponseDto | null;
} = {}) {
  return <StudentDashboardOverview initialData={initialData} />;
}

