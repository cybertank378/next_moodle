import AuthFeatureUnavailable from "@/sections/auth/organisms/AuthFeatureUnavailable";

export default function ChangePasswordForm() {
  return (
    <AuthFeatureUnavailable
      title="Ganti Kata Sandi"
      description="Perubahan kata sandi akan tersedia setelah modul autentikasi mendukungnya."
    />
  );
}
