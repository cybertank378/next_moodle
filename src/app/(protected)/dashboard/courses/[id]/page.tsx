import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CourseDetailView from "@/sections/courses/organisms/CourseDetailView";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  await requireDashboardRoles(["TENANT", "STUDENT"]);
  const { id } = await params;
  const courseId = Number(id) || 0;

  return <CourseDetailView courseId={courseId} />;
}
