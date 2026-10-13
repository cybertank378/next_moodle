import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import TenantWizardStepIndicator from "@/sections/tenant/atoms/TenantWizardStepIndicator";
import TenantBasicInformationStep from "@/sections/tenant/molecules/TenantBasicInformationStep";
import TenantConfigurationStep from "@/sections/tenant/molecules/TenantConfigurationStep";
import TenantMoodleCredentialStep from "@/sections/tenant/molecules/TenantMoodleCredentialStep";
import TenantProvisioningStatus from "@/sections/tenant/molecules/TenantProvisioningStatus";
import TenantReviewStep from "@/sections/tenant/molecules/TenantReviewStep";

describe("Tenant Creation Wizard Component Testing", () => {
  const steps = [
    { id: 1, title: "1. Info & Admin", description: "Profil & admin awal" },
    { id: 2, title: "2. Kredensial Moodle", description: "URL & token API" },
    { id: 3, title: "3. Konfigurasi", description: "Status ketersediaan" },
    { id: 4, title: "4. Review & Simpan", description: "Konfirmasi data" },
  ];

  describe("TenantWizardStepIndicator", () => {
    it("renders all 4 steps without ol or li tags", () => {
      const html = renderToStaticMarkup(
        <TenantWizardStepIndicator steps={steps} currentStep={2} />,
      );

      expect(html).toContain("1. Info &amp; Admin");
      expect(html).toContain("2. Kredensial Moodle");
      expect(html).toContain("3. Konfigurasi");
      expect(html).toContain("4. Review &amp; Simpan");
      expect(html).not.toContain("<ol");
      expect(html).not.toContain("<li");
    });
  });

  describe("TenantBasicInformationStep", () => {
    it("renders required basic info inputs and admin inputs", () => {
      const html = renderToStaticMarkup(
        <TenantBasicInformationStep
          data={{
            name: "SMA 1",
            slug: "sma1",
            customDomain: "ujian.sma1.sch.id",
            adminUsername: "admin_sma1",
            adminFirstname: "Admin",
            adminLastname: "Satu",
            adminEmail: "admin@sma1.sch.id",
            adminPassword: "Password123!",
          }}
          onChange={vi.fn()}
        />,
      );

      expect(html).toContain("Nama Institusi / Sekolah");
      expect(html).toContain("Slug (Subdomain URL)");
      expect(html).toContain("Username Admin");
      expect(html).toContain("Email Admin");
      expect(html).not.toContain("<ul");
      expect(html).not.toContain("<li");
    });
  });

  describe("TenantMoodleCredentialStep", () => {
    it("renders Moodle URL and password inputs without ul or li tags", () => {
      const html = renderToStaticMarkup(
        <TenantMoodleCredentialStep
          data={{
            moodleUrl: "https://moodle.sma1.sch.id",
            adminToken: "",
            proctorToken: "",
          }}
          onChange={vi.fn()}
        />,
      );

      expect(html).toContain("Moodle Base URL");
      expect(html).toContain("Admin Web Service Token");
      expect(html).toContain("Proctor Web Service Token");
      expect(html).toContain('type="password"');
      expect(html).not.toContain("<ul");
      expect(html).not.toContain("<li");
    });
  });

  describe("TenantConfigurationStep", () => {
    it("renders initial status options without ul or li tags", () => {
      const html = renderToStaticMarkup(
        <TenantConfigurationStep
          data={{ status: "ACTIVE" }}
          onChange={vi.fn()}
        />,
      );

      expect(html).toContain("ACTIVE — Siap digunakan langsung oleh pengguna");
      expect(html).toContain("MAINTENANCE");
      expect(html).toContain("SUSPENDED");
      expect(html).not.toContain("<ul");
      expect(html).not.toContain("<li");
    });
  });

  describe("TenantReviewStep", () => {
    it("renders review summary with masked tokens and without unformatted lists", () => {
      const html = renderToStaticMarkup(
        <TenantReviewStep
          basicInfo={{
            name: "SMA 1",
            slug: "sma1",
            customDomain: "ujian.sma1.sch.id",
            adminUsername: "admin_sma1",
            adminFirstname: "Admin",
            adminLastname: "Satu",
            adminEmail: "admin@sma1.sch.id",
            adminPassword: "Password123!",
          }}
          credentials={{
            moodleUrl: "https://moodle.sma1.sch.id",
            adminToken: "super_secret_token",
            proctorToken: "",
          }}
          configuration={{
            status: "ACTIVE",
          }}
          onEditStep={vi.fn()}
        />,
      );

      expect(html).toContain("SMA 1");
      expect(html).toContain("sma1");
      expect(html).toContain("admin_sma1");
      expect(html).toContain("••••••••••••••••••••");
      expect(html).not.toContain("super_secret_token");
      expect(html).not.toContain("<ul");
      expect(html).not.toContain("<li");
    });
  });

  describe("TenantProvisioningStatus", () => {
    it("renders partial success state with retry option when credential sync fails", () => {
      const html = renderToStaticMarkup(
        <TenantProvisioningStatus
          status="partial_success"
          errorMessage="Connection timed out"
          onNavigateToDetail={vi.fn()}
          onRetryCredential={vi.fn()}
        />,
      );

      expect(html).toContain("Tenant Dibuat, Kredensial Belum Terhubung");
      expect(html).toContain("Connection timed out");
      expect(html).toContain("Coba Ulang Kredensial");
      expect(html).toContain("Lanjutkan ke Detail Tenant");
    });
  });
});
