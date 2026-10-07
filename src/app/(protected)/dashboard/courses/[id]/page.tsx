import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import CourseDetailView from "@/sections/courses/organisms/CourseDetailView";

interface CourseDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  await requireDashboardRoles(["TENANT", "TEACHER", "STUDENT"]);
  const { id } = await params;
  return <CourseDetailView courseId={Number(id) || 0} />;
}
