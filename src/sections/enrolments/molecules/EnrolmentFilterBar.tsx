"use client";

import { BookOpen, UserPlus } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import SearchField from "@/shared-ui/component/SearchField";
import SelectField from "@/shared-ui/component/SelectField";

interface CourseOption {
  id: number;
  fullName: string;
}

interface Props {
  courses: CourseOption[];
  selectedCourseId: number | null;
  onCourseSelect: (courseId: number) => void;
  search: string;
  onSearchChange: (value: string) => void;
  onEnrolClick: () => void;
}

export default function EnrolmentFilterBar({
  courses,
  selectedCourseId,
  onCourseSelect,
  search,
  onSearchChange,
  onEnrolClick,
}: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
        {/* Course Selector */}
        <div className="relative min-w-[240px]">
          <BookOpen
            size={16}
            className="absolute left-3 top-[18px] -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none z-10"
          />
          <SelectField
            value={selectedCourseId ?? ""}
            onChange={(e) => onCourseSelect(Number(e.target.value))}
            className="pl-9"
          >
            <option value="" disabled>
              Pilih Mata Pelajaran...
            </option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.fullName}
              </option>
            ))}
          </SelectField>
        </div>

        {/* Search Input */}
        <div className="flex-1 max-w-sm">
          <SearchField
            value={search}
            onChange={onSearchChange}
            placeholder="Cari peserta terdaftar..."
            size="sm"
          />
        </div>
      </div>

      <div>
        <Button
          variant="filled"
          color="primary"
          onClick={onEnrolClick}
          disabled={!selectedCourseId}
          leftIcon={UserPlus}
          className="text-sm font-medium w-full sm:w-auto"
        >
          Daftarkan Peserta
        </Button>
      </div>
    </div>
  );
}
