import AuthFeatureUnavailable from "@/sections/auth/organisms/AuthFeatureUnavailable";

export default function RegisterForm() {
  return (
    <AuthFeatureUnavailable
      title="Buat Akun"
      description="Pendaftaran akun akan tersedia setelah modul autentikasi mendukungnya."
    />
  );
}
