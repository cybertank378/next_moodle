"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import StudentGradeReportView from "@/sections/results/organisms/StudentGradeReportView";
import Button from "@/shared-ui/component/Button";

export interface ResultDetailPageViewProps {
  courseId: number;
  userId?: number;
  courseTitle?: string;
}

export default function ResultDetailPageView({
  courseId,
  userId,
  courseTitle,
}: ResultDetailPageViewProps) {
  const router = useRouter();

  const handleNavigateToResults = () => {
    router.push(ROUTES.DASHBOARD.RESULTS);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={handleNavigateToResults}
          aria-label="Kembali ke halaman nilai"
        />
        <span className="text-sm text-gray-400">Kembali ke Daftar Nilai</span>
      </div>

      <StudentGradeReportView
        courseId={courseId}
        userId={userId}
        courseTitle={courseTitle}
      />
    </div>
  );
}
