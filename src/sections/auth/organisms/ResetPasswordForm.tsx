import AuthFeatureUnavailable from "@/sections/auth/organisms/AuthFeatureUnavailable";

export default function ResetPasswordForm() {
  return (
    <AuthFeatureUnavailable
      title="Atur Ulang Password"
      description="Pengaturan ulang kata sandi akan tersedia setelah modul autentikasi mendukungnya."
    />
  );
}
