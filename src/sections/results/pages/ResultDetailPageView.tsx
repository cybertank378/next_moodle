"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRouteConstants } from "@/libs/routes";
import Button from "@/shared-ui/component/Button";
import StudentGradeReportView from "../organisms/StudentGradeReportView";

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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={() => router.push(`${AppRouteConstants.DASHBOARD}/results`)}
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
