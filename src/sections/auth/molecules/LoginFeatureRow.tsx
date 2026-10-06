// Files: src/sections/auth/molecules/LoginFeatureRow.tsx

import clsx from "clsx";
import { BookOpen, FileText, Users } from "lucide-react";
import AuthFeatureIcon from "@/sections/auth/atoms/AuthFeatureIcon";

export interface LoginFeatureRowProps {
  readonly className?: string;
}

export default function LoginFeatureRow({ className }: LoginFeatureRowProps) {
  const features = [
    {
      id: "learning",
      title: "Pembelajaran",
      description: "Akses materi kapan saja dan di mana saja.",
      icon: BookOpen,
    },
    {
      id: "exams",
      title: "Ujian Online",
      description: "Laksanakan ujian dengan aman dan terstandar.",
      icon: FileText,
    },
    {
      id: "management",
      title: "Manajemen Sekolah",
      description: "Kelola kelas, pengguna, dan kegiatan akademik.",
      icon: Users,
    },
  ];

  return (
    <div
      className={clsx(
        "grid grid-cols-1 md:grid-cols-3 gap-5 xl:gap-6 w-full",
        className,
      )}
    >
      {features.map((feature) => (
        <AuthFeatureIcon
          description={feature.description}
          icon={feature.icon}
          key={feature.id}
          title={feature.title}
        />
      ))}
    </div>
  );
}
