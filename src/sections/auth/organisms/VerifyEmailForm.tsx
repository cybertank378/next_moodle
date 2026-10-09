import AuthFeatureUnavailable from "@/sections/auth/organisms/AuthFeatureUnavailable";

export default function VerifyEmailForm() {
  return (
    <AuthFeatureUnavailable
      title="Verifikasi Email"
      description="Verifikasi email akan tersedia setelah modul autentikasi mendukungnya."
    />
  );
}
