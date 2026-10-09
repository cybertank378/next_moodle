"use client";

import { Upload, UserPlus } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import SearchField from "@/shared-ui/component/SearchField";

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
      <div className="flex-1 max-w-md">
        <SearchField
          value={search}
          onChange={onSearchChange}
          placeholder="Cari nama, username, atau email..."
          size="sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          color="primary"
          size="sm"
          onClick={onImportClick}
          leftIcon={Upload}
        >
          Import CSV
        </Button>
        <Button
          variant="filled"
          color="primary"
          size="sm"
          onClick={onCreateClick}
          leftIcon={UserPlus}
        >
          Tambah Pengguna
        </Button>
      </div>
    </div>
  );
}
