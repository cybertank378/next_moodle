"use client";

import { Dices, X } from "lucide-react";
import React, { useState } from "react";
import type { QuestionCategory } from "@/modules/questions/domain/types/QuestionTypes";
import Button from "@/shared-ui/component/Button";

interface AddRandomQuestionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: QuestionCategory[];
  onConfirm: (
    categoryId: number,
    randomCount: number,
    includeSubcategories: boolean,
  ) => Promise<void>;
  loading?: boolean;
}

export default function AddRandomQuestionsModal({
  isOpen,
  onClose,
  categories,
  onConfirm,
  loading = false,
}: AddRandomQuestionsModalProps) {
  const [categoryId, setCategoryId] = useState<number>(
    categories[0]?.id || 1,
  );
  const [randomCount, setRandomCount] = useState<number>(5);
  const [includeSubcategories, setIncludeSubcategories] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryId || categoryId <= 0) {
      setError("Pilih kategori Bank Soal yang valid.");
      return;
    }
    if (!randomCount || randomCount <= 0) {
      setError("Jumlah soal acak minimal 1.");
      return;
    }

    setError(null);
    try {
      await onConfirm(categoryId, randomCount, includeSubcategories);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Gagal menambahkan soal acak.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Dices className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Tambah Soal Acak dari Bank Soal
              </h3>
              <p className="text-[11px] text-slate-500">
                Pilih kategori dan jumlah butir soal yang diacak
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 border border-rose-200 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Kategori Bank Soal <span className="text-rose-500">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(parseInt(e.target.value, 10))}
              disabled={loading}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} {c.questionCount ? `(${c.questionCount} soal)` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-900 mb-1.5">
              Jumlah Butir Soal Acak <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              value={randomCount}
              onChange={(e) => setRandomCount(parseInt(e.target.value, 10) || 1)}
              disabled={loading}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <p className="text-[11px] text-slate-500 mt-1">
              Moodle akan memilih secara dinamis saat siswa memulai sesi ujian.
            </p>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="includeSub"
              checked={includeSubcategories}
              onChange={(e) => setIncludeSubcategories(e.target.checked)}
              disabled={loading}
              className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <label
              htmlFor="includeSub"
              className="text-xs text-slate-700 cursor-pointer"
            >
              Sertakan soal dari sub-kategori
            </label>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </Button>
            <Button
              type="submit"
              color="primary"
              size="sm"
              loading={loading}
            >
              Tambahkan ke Ujian
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
