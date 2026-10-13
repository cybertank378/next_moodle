"use client";

import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import Button from "@/shared-ui/component/Button";

interface TenantProvisioningStatusProps {
  status:
    | "idle"
    | "creating_tenant"
    | "configuring_credentials"
    | "success"
    | "partial_success"
    | "error";
  errorMessage?: string | null;
  tenantId?: string | null;
  onNavigateToDetail: () => void;
  onRetryCredential?: () => void;
}

export default function TenantProvisioningStatus({
  status,
  errorMessage,
  tenantId: _tenantId,
  onNavigateToDetail,
  onRetryCredential,
}: TenantProvisioningStatusProps) {
  if (status === "creating_tenant" || status === "configuring_credentials") {
    return (
      <div className="rounded-2xl border border-indigo-100 bg-indigo-50/40 p-8 text-center space-y-4">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 animate-spin">
          <RefreshCw className="w-6 h-6" />
        </div>
        <div>
          <h4 className="text-base font-semibold text-indigo-950">
            {status === "creating_tenant"
              ? "Membuat Metadata Tenant & Akun Admin..."
              : "Menghubungkan & Mengenkripsi Kredensial Moodle..."}
          </h4>
          <p className="text-xs text-indigo-700 mt-1">
            Mohon jangan menutup halaman ini selama proses provisioning
            berlangsung.
          </p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50/50 p-8 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-emerald-950">
            Tenant Berhasil Dibuat & Dikonfigurasi!
          </h4>
          <p className="text-xs text-emerald-800 mt-1">
            Metadata institusi, akun administrator awal, dan koneksi server
            Moodle telah tersimpan dengan aman.
          </p>
        </div>
        <div>
          <Button
            variant="filled"
            color="primary"
            onClick={onNavigateToDetail}
            rightIcon={ArrowRight}
          >
            Buka Halaman Detail Tenant
          </Button>
        </div>
      </div>
    );
  }

  if (status === "partial_success") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-8 text-center space-y-5">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-100 text-amber-600">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <div>
          <h4 className="text-lg font-bold text-amber-950">
            Tenant Dibuat, Kredensial Belum Terhubung
          </h4>
          <p className="text-xs text-amber-800 mt-1 max-w-md mx-auto">
            Tenant dan akun administrator berhasil dibuat, tetapi sinkronisasi
            kredensial Moodle gagal:{" "}
            <span className="font-semibold">
              {errorMessage || "Periksa URL dan Token Moodle Anda."}
            </span>
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          {onRetryCredential && (
            <Button
              variant="outline"
              color="secondary"
              onClick={onRetryCredential}
              leftIcon={RefreshCw}
            >
              Coba Ulang Kredensial
            </Button>
          )}
          <Button
            variant="filled"
            color="primary"
            onClick={onNavigateToDetail}
            rightIcon={ArrowRight}
          >
            Lanjutkan ke Detail Tenant
          </Button>
        </div>
      </div>
    );
  }

  return null;
}
