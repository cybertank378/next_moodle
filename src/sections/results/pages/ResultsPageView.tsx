import ResultsManagementView from "../organisms/ResultsManagementView";

export interface ResultsPageViewProps {
  userRole: "STUDENT" | "TENANT" | "ADMIN";
}

export default function ResultsPageView({ userRole }: ResultsPageViewProps) {
  return <ResultsManagementView userRole={userRole} />;
}
