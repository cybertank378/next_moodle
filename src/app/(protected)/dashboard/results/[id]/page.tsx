import { requireDashboardRoles } from "@/modules/auth/server/requireDashboardRoles";
import ResultDetailPageView from "@/sections/results/pages/ResultDetailPageView";

interface ResultDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultDetailPage({
  params,
}: ResultDetailPageProps) {
  await requireDashboardRoles(["ADMIN", "TENANT", "STUDENT"]);
  const { id } = await params;
  const courseId = Number(id) || 0;

  return <ResultDetailPageView courseId={courseId} />;
}
