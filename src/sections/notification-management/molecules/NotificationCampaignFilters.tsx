// Files: src/sections/notification-management/molecules/NotificationCampaignFilters.tsx
"use client";

import { Search, Filter, Archive } from "lucide-react";
import TextField from "@/shared-ui/component/TextField";
import SelectField from "@/shared-ui/component/SelectField";
import Button from "@/shared-ui/component/Button";

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  isArchived: boolean;
  onArchiveToggle: () => void;
}

export default function NotificationCampaignFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  isArchived,
  onArchiveToggle,
}: Props) {
  const statusOptions = [
    { value: "ALL", label: "Semua Status" },
    { value: "DRAFT", label: "Draft" },
    { value: "SCHEDULED", label: "Terjadwal" },
    { value: "QUEUED", label: "Dalam Antrean" },
    { value: "PROCESSING", label: "Sedang Diproses" },
    { value: "COMPLETED", label: "Selesai" },
    { value: "PARTIAL_FAILED", label: "Sebagian Gagal" },
    { value: "FAILED", label: "Gagal" },
    { value: "CANCELLED", label: "Dibatalkan" },
  ];

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex-1 max-w-md">
        <TextField
          id="campaign-search"
          placeholder="Cari judul pengumuman..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftIcon={Search}
        />
      </div>

      <div className="flex items-center gap-3">
        <div className="w-44">
          <SelectField
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value)}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </SelectField>
        </div>

        <Button
          type="button"
          variant={isArchived ? "secondary" : "outline"}
          size="sm"
          onClick={onArchiveToggle}
          className="flex items-center gap-1.5 text-xs whitespace-nowrap"
        >
          <Archive className="w-3.5 h-3.5" />
          {isArchived ? "Tampilkan Aktif" : "Diarsipkan"}
        </Button>
      </div>
    </div>
  );
}
