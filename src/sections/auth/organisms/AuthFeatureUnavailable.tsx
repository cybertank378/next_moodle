"use client";

import { CircleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/libs/routes";
import AuthFrame from "@/sections/auth/organisms/AuthFrame";
import Button from "@/shared-ui/component/Button";

interface AuthFeatureUnavailableProps {
  readonly title: string;
  readonly description: string;
}

export default function AuthFeatureUnavailable({
  title,
  description,
}: AuthFeatureUnavailableProps) {
  const router = useRouter();

  return (
    <AuthFrame title={title} description={description}>
      <div className="space-y-5 text-center">
        <CircleAlert className="mx-auto h-14 w-14 text-amber-500" />
        <p className="text-[#66739f]">
          Fitur ini belum tersedia karena modul autentikasi belum menyediakan
          endpoint yang diperlukan.
        </p>
        <Button
          fullWidth
          size="lg"
          onClick={() => router.push(ROUTES.AUTH.LOGIN)}
        >
          Kembali ke Login
        </Button>
      </div>
    </AuthFrame>
  );
}
