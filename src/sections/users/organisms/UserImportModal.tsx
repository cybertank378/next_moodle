"use client";

import { AlertCircle, CheckCircle, FileText, Upload } from "lucide-react";
import type React from "react";
import { useId, useState } from "react";
import type { BulkImportUsersRequestDto } from "@/modules/user/domain/dto/UserRequestDto";
import type { BulkImportUsersResponseDto } from "@/modules/user/domain/dto/UserResponseDto";
import { UserImportParser } from "@/modules/user/domain/mapper/UserImportParser";
import { Modal } from "@/shared-ui/component/Modal";

interface Props {
  open: boolean;
  onClose: () => void;
  onImport: (
    req: BulkImportUsersRequestDto,
  ) => Promise<BulkImportUsersResponseDto | null>;
  loading?: boolean;
}

export default function UserImportModal({
  open,
  onClose,
  onImport,
  loading = false,
}: Props) {
  const fileInputId = useId();
  const [csvText, setCsvText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [defaultPassword, setDefaultPassword] = useState("Password123!");
  const [importResult, setImportResult] =
    useState<BulkImportUsersResponseDto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvText(text || "");
    };
    reader.readAsText(file);
  };

  const parsedPreview = csvText.trim()
    ? UserImportParser.parseCsv(csvText, defaultPassword)
    : null;

  const handleSubmit = async () => {
    if (!csvText.trim()) {
      setErrorMsg("Harap unggah file CSV atau tempel isi CSV terlebih dahulu.");
      return;
    }

    setErrorMsg(null);
    const res = await onImport({
      csvContent: csvText,
      defaultPassword,
    });

    if (res) {
      setImportResult(res);
    }
  };

  const handleClose = () => {
    setCsvText("");
    setFileName(null);
    setImportResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onSubmit={importResult ? handleClose : handleSubmit}
      title="Import Pengguna dari CSV"
      subtitle="Unggah data pengguna massal menggunakan file format CSV."
      submitText={
        importResult ? "Selesai" : loading ? "Mengimpor..." : "Mulai Import"
      }
      cancelText={importResult ? undefined : "Batal"}
      submitDisabled={loading}
      submitLoading={loading}
      size="lg"
    >
      <div className="space-y-4 py-2">
        {errorMsg && (
          <div className="rounded-lg bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 p-3 text-sm text-rose-600 dark:text-rose-400">
            {errorMsg}
          </div>
        )}

        {importResult ? (
          <div className="space-y-4">
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4 space-y-3">
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm">
                <CheckCircle size={18} />
                <span>
                  Berhasil mengimpor {importResult.importedCount} pengguna.
                </span>
              </div>
              {importResult.failedCount > 0 && (
                <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-sm">
                  <AlertCircle size={18} />
                  <span>{importResult.failedCount} baris gagal diproses.</span>
                </div>
              )}
            </div>

            {importResult.errors.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                  Rincian Error:
                </p>
                <div className="max-h-48 overflow-y-auto space-y-1.5 rounded-lg border border-rose-200 dark:border-rose-800/40 p-3 bg-rose-50/50 dark:bg-rose-950/20">
                  {importResult.errors.map((err) => (
                    <div
                      key={`err-row-${err.row}-${err.error}`}
                      className="text-xs text-rose-600 dark:text-rose-400"
                    >
                      Baris {err.row}: {err.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <div>
              <label
                htmlFor={fileInputId}
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2"
              >
                Pilih File CSV
              </label>
              <div className="flex items-center gap-3">
                <label
                  htmlFor={fileInputId}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg border border-dashed border-gray-300 dark:border-slate-700 hover:border-indigo-500 cursor-pointer bg-gray-50 dark:bg-slate-900/40 text-sm text-gray-700 dark:text-gray-300"
                >
                  <Upload size={16} />
                  <span>{fileName ? fileName : "Upload CSV file"}</span>
                </label>
                <input
                  id={fileInputId}
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                {fileName && (
                  <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <FileText size={14} /> Terpilih
                  </span>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="import-default-password"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Password Default (jika baris CSV tidak memiliki password)
              </label>
              <input
                id="import-default-password"
                type="text"
                value={defaultPassword}
                onChange={(e) => setDefaultPassword(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#151521] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label
                htmlFor="import-csv-textarea"
                className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1"
              >
                Atau Tempel Teks CSV Langsung
              </label>
              <textarea
                id="import-csv-textarea"
                rows={5}
                value={csvText}
                onChange={(e) => setCsvText(e.target.value)}
                placeholder="username,firstname,lastname,email,idnumber,role&#10;siswa01,Ahmad,Dahlan,ahmad@sekolah.sch.id,1001,student"
                className="w-full font-mono text-xs px-3 py-2 rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-[#151521] text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {parsedPreview && (
              <div className="rounded-lg border border-slate-200 dark:border-slate-800 p-3 bg-slate-50 dark:bg-slate-900/30 text-xs space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Ringkasan Preview:
                </p>
                <p className="text-emerald-600 dark:text-emerald-400">
                  {parsedPreview.users.length} data valid siap diimpor.
                </p>
                {parsedPreview.errors.length > 0 && (
                  <p className="text-rose-500 dark:text-rose-400">
                    {parsedPreview.errors.length} baris memiliki format tidak
                    lengkap/salah.
                  </p>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}
