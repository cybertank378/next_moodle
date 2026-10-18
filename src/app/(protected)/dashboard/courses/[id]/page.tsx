import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CourseDetailPageView from "@/sections/courses/pages/CourseDetailPageView";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const actor = await requireDashboardRoles(["TENANT", "TEACHER", "STUDENT"]);
  if (!actor) return null;
  const { id } = await params;
  return (
    <CourseDetailPageView
      courseId={Number(id) || 0}
      userRole={actor.role}
    />
  );
}

