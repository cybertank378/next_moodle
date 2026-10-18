import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import type { ActivityType } from "@/sections/exam/molecules/ActivityTypeSelector";
import CreateActivityPageView from "@/sections/exam/pages/CreateActivityPageView";

interface CreateExamPageProps {
  searchParams: Promise<{
    courseId?: string;
    type?: string;
  }>;
}

export default async function CreateExamPage({
  searchParams,
}: CreateExamPageProps) {
  await requireDashboardRoles(["TENANT", "TEACHER", "ADMIN"]);

  const resolvedParams = await searchParams;
  const courseId = resolvedParams.courseId
    ? parseInt(resolvedParams.courseId, 10)
    : 0;

  const validTypes: ActivityType[] = ["quiz", "materi", "tugas"];
  const initialType: ActivityType =
    resolvedParams.type && validTypes.includes(resolvedParams.type as ActivityType)
      ? (resolvedParams.type as ActivityType)
      : "quiz";

  return (
    <CreateActivityPageView courseId={courseId} initialType={initialType} />
  );
}
