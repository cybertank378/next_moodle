"use client";

import {
  Award,
  BookOpen,
  FileQuestion,
  FileText,
  Layers,
  MessageSquare,
} from "lucide-react";

export type CourseTab =
  | "overview"
  | "materi"
  | "tugas"
  | "ujian"
  | "forum"
  | "nilai";

interface CourseTabNavProps {
  activeTab: CourseTab;
  onSelectTab: (tab: CourseTab) => void;
}

const TABS = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "materi", label: "Materi", icon: Layers },
  { id: "ujian", label: "Ujian", icon: FileQuestion },
  { id: "nilai", label: "Nilai", icon: Award },
  { id: "tugas", label: "Tugas", icon: FileText, blocked: true },
  { id: "forum", label: "Forum", icon: MessageSquare, blocked: true },
] as const;

export default function CourseTabNav({
  activeTab,
  onSelectTab,
}: CourseTabNavProps) {
  return (
    <div className="border-b border-slate-200 flex gap-2 overflow-x-auto no-scrollbar pt-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        const isBlocked = "blocked" in tab && tab.blocked;

        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectTab(tab.id as CourseTab)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300"
            }`}
          >
            <Icon size={16} />
            <span>{tab.label}</span>
            {isBlocked && (
              <span className="text-[10px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-normal">
                Segera
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
