import type { UserRole } from "@/libs/enums";
import ResultsManagementView from "@/sections/results/organisms/ResultsManagementView";

export interface ResultsPageViewProps {
  userRole: UserRole;
}

export default function ResultsPageView({ userRole }: ResultsPageViewProps) {
  return <ResultsManagementView userRole={userRole} />;
}
