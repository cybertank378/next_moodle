import AuthFeatureUnavailable from "@/sections/auth/organisms/AuthFeatureUnavailable";

export default function ForgetPasswordForm() {
  return (
    <AuthFeatureUnavailable
      title="Lupa Password"
      description="Pemulihan kata sandi akan tersedia setelah modul autentikasi mendukungnya."
    />
  );
}
