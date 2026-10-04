"use client";

import SearchField from "@/shared-ui/component/SearchField";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
}

export default function QuizFilterBar({ search, onSearchChange }: Props) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="w-full max-w-sm">
        <SearchField
          placeholder="Cari ujian atau kuis..."
          value={search}
          onChange={onSearchChange}
        />
      </div>
    </div>
  );
}
