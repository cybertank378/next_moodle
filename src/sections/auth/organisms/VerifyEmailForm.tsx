"use client";

import { CheckCircle, Mail, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

export default function VerifyEmailForm() {
  const router = useRouter();
  return (
    <AuthFrame
      title="Verifikasi Email"
      description="Periksa inbox Anda untuk menyelesaikan verifikasi akun."
    >
      <div className="space-y-5 text-center">
        <CheckCircle className="mx-auto h-14 w-14 text-emerald-500" />
        <p className="text-[#66739f]">
          Kami telah mengirim tautan verifikasi ke email Anda.
        </p>
        <Button
          fullWidth
          size="lg"
          onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        >
          Kembali ke Login
        </Button>
        <Button fullWidth leftIcon={RefreshCw} size="lg" variant="outline">
          Kirim Ulang Email
        </Button>
        <p className="flex items-center justify-center gap-2 text-xs text-[#66739f]">
          <Mail className="h-4 w-4" />
          Pastikan alamat email Anda benar.
        </p>
      </div>
    </AuthFrame>
  );
}
