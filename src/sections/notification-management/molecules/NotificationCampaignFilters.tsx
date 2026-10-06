// Files: src/sections/notification-management/molecules/NotificationCampaignFilters.tsx
"use client";

import { Calendar, ChevronDown, RotateCcw, Search, X } from "lucide-react";
import Button from "@/shared-ui/component/Button";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

export interface StatusCountMap {
  total?: number;
  sent?: number;
  scheduled?: number;
  draft?: number;
}

interface Props {
  search: string;
  onSearchChange: (val: string) => void;
  status: string;
  onStatusChange: (val: string) => void;
  channel: string;
  onChannelChange: (val: string) => void;
  tenant?: string;
  onTenantChange?: (val: string) => void;
  tenantOptions?: { value: string; label: string }[];
  date?: string;
  onDateChange?: (val: string) => void;
  isArchived: boolean;
  onArchiveToggle: (archived: boolean) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  counts?: StatusCountMap;
}

export default function NotificationCampaignFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  channel,
  onChannelChange,
  tenant = "ALL",
  onTenantChange,
  tenantOptions,
  date = "",
  onDateChange,
  isArchived,
  onArchiveToggle,
  onResetFilters,
  hasActiveFilters,
  counts,
}: Props) {
  const tabs = [
    {
      id: "all",
      label: "Semua",
      count: counts?.total,
      isActive: !isArchived && status === "ALL",
      onClick: () => {
        onArchiveToggle(false);
        onStatusChange("ALL");
      },
    },
    {
      id: "sent",
      label: "Terkirim",
      count: counts?.sent,
      isActive: !isArchived && status === "COMPLETED",
      onClick: () => {
        onArchiveToggle(false);
        onStatusChange("COMPLETED");
      },
    },
    {
      id: "scheduled",
      label: "Terjadwal",
      count: counts?.scheduled,
      isActive: !isArchived && status === "SCHEDULED",
      onClick: () => {
        onArchiveToggle(false);
        onStatusChange("SCHEDULED");
      },
    },
    {
      id: "draft",
      label: "Draft",
      count: counts?.draft,
      isActive: !isArchived && status === "DRAFT",
      onClick: () => {
        onArchiveToggle(false);
        onStatusChange("DRAFT");
      },
    },
    {
      id: "archive",
      label: "Arsip",
      count: undefined,
      isActive: isArchived,
      onClick: () => {
        onArchiveToggle(true);
        onStatusChange("ALL");
      },
    },
  ];

  const channelOptions = [
    { value: "ALL", label: "Semua Kanal" },
    { value: "IN_APP", label: "Inbox" },
    { value: "PUSH", label: "Push" },
  ];

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
      {/* Top Status Tabs */}
      <div className="flex items-center gap-2 px-6 pt-2 border-b border-slate-200 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={tab.onClick}
            className={`flex items-center gap-2 py-3.5 px-2 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
              tab.isActive
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-slate-600 hover:text-slate-900"
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  tab.isActive
                    ? "bg-blue-100 text-blue-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Filter Row */}
      <div className="p-4 sm:p-5 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
        {/* Search */}
        <div className="flex-1 min-w-[240px] max-w-md relative">
          <TextField
            id="campaign-search"
            placeholder="Cari judul pengumuman..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            leftIcon={Search}
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              aria-label="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Channel dropdown */}
          <div className="w-36 sm:w-40">
            <SelectField
              id="channel-filter"
              value={channel}
              onChange={(e) => onChannelChange(e.target.value)}
            >
              {channelOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </SelectField>
          </div>

          {/* Tenant dropdown (for platform admin) */}
          <div className="w-36 sm:w-44">
            <SelectField
              id="tenant-filter"
              value={tenant}
              onChange={(e) => onTenantChange?.(e.target.value)}
            >
              <option value="ALL">Semua Tenant</option>
              {tenantOptions && tenantOptions.length > 0 ? (
                tenantOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              ) : (
                <>
                  <option value="SMP Hangtuah 2">SMP Hangtuah 2</option>
                  <option value="SMA Negeri 1">SMA Negeri 1</option>
                </>
              )}
            </SelectField>
          </div>

          {/* Date filter matching Mockup 1: Calendar icon and chevron */}
          <div className="w-36 sm:w-44 relative">
            <div className="relative flex items-center">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-500 z-10">
                <Calendar className="w-4 h-4 text-slate-400" />
              </div>
              <input
                id="date-filter"
                type="date"
                value={date}
                onChange={(e) => onDateChange?.(e.target.value)}
                className="w-full h-11 pl-9 pr-8 text-xs bg-white border border-gray-300 rounded-lg text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                aria-label="Pilih tanggal"
              />
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-500 z-10">
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Reset Filters button */}
          {hasActiveFilters && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onResetFilters}
              className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900"
              aria-label="Reset semua filter"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filter
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
