"use client";

import { Search, Upload, UserPlus } from "lucide-react";
import Button from "@/shared-ui/component/Button";

interface Props {
  search: string;
  onSearchChange: (value: string) => void;
  onCreateClick: () => void;
  onImportClick: () => void;
}

export default function UserFilterBar({
  search,
  onSearchChange,
  onCreateClick,
  onImportClick,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
      <div className="relative flex-1 max-w-md">
        <Search
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Cari nama, username, atau email..."
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#151521] text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          color="primary"
          onClick={onImportClick}
          leftIcon={Upload}
          className="text-sm font-medium"
        >
          Import CSV
        </Button>
        <Button
          variant="filled"
          color="primary"
          onClick={onCreateClick}
          leftIcon={UserPlus}
          className="text-sm font-medium"
        >
          Tambah Pengguna
        </Button>
      </div>
    </div>
  );
}
