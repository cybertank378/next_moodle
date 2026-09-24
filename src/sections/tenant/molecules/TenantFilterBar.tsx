"use client";

import { useCallback, useState } from "react";

import Button from "@/shared-ui/component/Button";
import SearchField from "@/shared-ui/component/SearchField";
import SelectField from "@/shared-ui/component/SelectField";

const STATUS_OPTIONS = [
  { label: "Semua Status", value: "" },
  { label: "Aktif", value: "ACTIVE" },
  { label: "Pemeliharaan", value: "MAINTENANCE" },
  { label: "Ditangguhkan", value: "SUSPENDED" },
] as const;

interface FilterValue {
  status: string;
  search: string;
}

interface Props {
  initialValues?: Partial<FilterValue>;
  onFilterChangeAction: (value: FilterValue) => void;
}

export function TenantFilterBar({
  initialValues,
  onFilterChangeAction,
}: Props) {
  const [status, setStatus] = useState(initialValues?.status ?? "");
  const [search, setSearch] = useState(initialValues?.search ?? "");

  const apply = useCallback(() => {
    onFilterChangeAction({
      status,
      search,
    });
  }, [status, search, onFilterChangeAction]);

  const reset = useCallback(() => {
    setStatus("");
    setSearch("");

    onFilterChangeAction({
      status: "",
      search: "",
    });
  }, [onFilterChangeAction]);

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="min-w-[200px] flex-1">
        <SearchField
          placeholder="Cari nama atau slug..."
          value={search}
          onChange={setSearch}
        />
      </div>

      <div className="w-44">
        <SelectField
          label=""
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </SelectField>
      </div>

      <Button
        id="tenant-filter-apply"
        variant="filled"
        color="primary"
        size="sm"
        onClick={apply}
      >
        Terapkan
      </Button>

      <Button
        id="tenant-filter-reset"
        variant="outline"
        color="secondary"
        size="sm"
        onClick={reset}
      >
        Reset
      </Button>
    </div>
  );
}