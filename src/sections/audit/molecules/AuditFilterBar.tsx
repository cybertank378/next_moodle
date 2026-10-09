"use client";

import { ChevronDown, Filter, RotateCcw, SlidersHorizontal } from "lucide-react";
import { type FormEvent, useEffect, useState } from "react";
import type { AuditQuery } from "@/modules/audit/domain/builder/AuditQueryBuilder";
import Button from "@/shared-ui/component/Button";
import SelectField from "@/shared-ui/component/SelectField";
import TextField from "@/shared-ui/component/TextField";

interface AuditFilterBarProps {
  query: AuditQuery;
  isAdmin: boolean;
  onApply: (query: AuditQuery) => void;
  onReset: () => void;
}

export function AuditFilterBar({
  query,
  isAdmin,
  onApply,
  onReset,
}: AuditFilterBarProps) {
  const [draft, setDraft] = useState<AuditQuery>(query);
  const [advanced, setAdvanced] = useState(false);

  useEffect(() => {
    setDraft(query);
  }, [query]);

  const update = (key: keyof AuditQuery, value: string) => {
    setDraft((previous) => ({
      ...previous,
      [key]: value.trim() || undefined,
    }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onApply({
      ...draft,
      page: 1,
      tenantId: isAdmin ? draft.tenantId : undefined,
    });
  };

  const hasAdvancedFilters = Boolean(
    draft.from ||
      draft.to ||
      draft.action ||
      draft.resource ||
      (isAdmin && draft.tenantId),
  );

  return (
    <form
      onSubmit={handleSubmit}
      aria-label="Filter log audit"
      className="rounded-xl border border-slate-200 bg-slate-50/70 p-3 sm:p-4"
    >
      <div className="grid grid-cols-1 items-end gap-3 md:grid-cols-2 xl:grid-cols-[minmax(260px,2fr)_minmax(150px,1fr)_minmax(150px,1fr)_auto_auto]">
        <div className="min-w-0">
          <TextField
            label="Cari aktivitas"
            aria-label="Cari pengguna, aksi, atau resource"
            placeholder="Nama pengguna, aksi, resource..."
            size="md"
            value={draft.search ?? ""}
            onChange={(event) => update("search", event.target.value)}
            maxLength={150}
            className="h-11 rounded-lg border-slate-200 bg-white"
          />
        </div>

        <div className="min-w-0">
          <SelectField
            label="Role pengguna"
            size="md"
            value={draft.actorRole ?? ""}
            onChange={(event) => update("actorRole", event.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-white"
          >
            <option value="">Semua role</option>
            {["ADMIN", "TENANT", "PROCTOR", "TEACHER", "STUDENT", "SYSTEM"].map(
              (role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ),
            )}
          </SelectField>
        </div>

        <div className="min-w-0">
          <SelectField
            label="Urutkan"
            size="md"
            value={draft.sortOrder}
            onChange={(event) => update("sortOrder", event.target.value)}
            className="h-11 rounded-lg border-slate-200 bg-white"
          >
            <option value="desc">Terbaru</option>
            <option value="asc">Terlama</option>
          </SelectField>
        </div>

        <Button
          type="submit"
          leftIcon={Filter}
          className="h-11 min-w-28 rounded-lg px-4 shadow-sm md:w-full xl:w-auto"
        >
          Terapkan
        </Button>

        <Button
          type="button"
          variant="outline"
          color="secondary"
          leftIcon={RotateCcw}
          onClick={onReset}
          className="h-11 min-w-24 rounded-lg bg-white px-4 md:w-full xl:w-auto"
        >
          Reset
        </Button>
      </div>

      <div className="mt-3 border-t border-slate-200/80 pt-2">
        <Button
          type="button"
          variant="ghost"
          color="secondary"
          leftIcon={SlidersHorizontal}
          aria-expanded={advanced}
          aria-controls="audit-advanced-filters"
          onClick={() => setAdvanced((previous) => !previous)}
          className="min-h-9 rounded-lg px-2 text-xs font-semibold"
        >
          <span className="inline-flex items-center gap-2">
            Filter lanjutan
            {hasAdvancedFilters && (
              <span className="h-2 w-2 rounded-full bg-indigo-500" aria-label="Filter lanjutan aktif" />
            )}
            <ChevronDown
              aria-hidden="true"
              size={14}
              className={`transition-transform ${advanced ? "rotate-180" : ""}`}
            />
          </span>
        </Button>
      </div>

      {advanced && (
        <div
          id="audit-advanced-filters"
          className="mt-3 grid gap-3 rounded-lg border border-slate-200 bg-white p-3 sm:grid-cols-2 xl:grid-cols-4"
        >
          <TextField
            label="Dari tanggal (WIB)"
            type="date"
            size="md"
            value={draft.from ?? ""}
            onChange={(event) => update("from", event.target.value)}
          />
          <TextField
            label="Sampai tanggal (WIB)"
            type="date"
            size="md"
            value={draft.to ?? ""}
            onChange={(event) => update("to", event.target.value)}
          />
          <TextField
            label="Aksi"
            size="md"
            placeholder="Contoh: auth.login"
            value={draft.action ?? ""}
            onChange={(event) => update("action", event.target.value)}
          />
          <TextField
            label="Resource"
            size="md"
            placeholder="Contoh: session"
            value={draft.resource ?? ""}
            onChange={(event) => update("resource", event.target.value)}
          />
          {isAdmin && (
            <TextField
              label="Tenant ID"
              size="md"
              value={draft.tenantId ?? ""}
              onChange={(event) => update("tenantId", event.target.value)}
            />
          )}
        </div>
      )}
    </form>
  );
}
