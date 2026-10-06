// Files: src/sections/auth/molecules/LoginFeatureRow.tsx

import clsx from "clsx";
import { Building2, FileCheck2, GraduationCap } from "lucide-react";
import AuthFeatureIcon from "@/sections/auth/atoms/AuthFeatureIcon";

export interface LoginFeatureRowProps {
  readonly className?: string;
}

export default function LoginFeatureRow({ className }: LoginFeatureRowProps) {
  const features = [
    {
      id: "learning",
      label: "Pembelajaran",
      icon: GraduationCap,
    },
    {
      id: "exams",
      label: "Ujian Online",
      icon: FileCheck2,
    },
    {
      id: "management",
      label: "Manajemen Sekolah",
      icon: Building2,
    },
  ];

  return (
    <div
      className={clsx(
        "flex flex-wrap items-center gap-2.5 sm:gap-3",
        className,
      )}
    >
      {features.map((feature) => (
        <AuthFeatureIcon
          icon={feature.icon}
          key={feature.id}
          label={feature.label}
        />
      ))}
    </div>
  );
}
