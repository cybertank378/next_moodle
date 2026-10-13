"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ROUTES } from "@/libs/routes";
import type { TenantStatus } from "@/modules/tenant/domain/types/TenantMetadata";
import { useTenantApi } from "@/modules/tenant/presentation/hooks/useTenantApi";
import TenantWizardStepIndicator, {
  type WizardStep,
} from "@/sections/tenant/atoms/TenantWizardStepIndicator";
import TenantBasicInformationStep, {
  type BasicInformationData,
} from "@/sections/tenant/molecules/TenantBasicInformationStep";
import TenantConfigurationStep, {
  type TenantConfigurationData,
} from "@/sections/tenant/molecules/TenantConfigurationStep";
import TenantMoodleCredentialStep, {
  type MoodleCredentialData,
} from "@/sections/tenant/molecules/TenantMoodleCredentialStep";
import TenantProvisioningStatus from "@/sections/tenant/molecules/TenantProvisioningStatus";
import TenantReviewStep from "@/sections/tenant/molecules/TenantReviewStep";
import Button from "@/shared-ui/component/Button";

const WIZARD_STEPS: WizardStep[] = [
  { id: 1, title: "1. Info & Admin", description: "Profil & admin awal" },
  { id: 2, title: "2. Kredensial Moodle", description: "URL & token API" },
  { id: 3, title: "3. Konfigurasi", description: "Status ketersediaan" },
  { id: 4, title: "4. Review & Simpan", description: "Konfirmasi data" },
];

export default function TenantCreateView() {
  const router = useRouter();
  const { createTenant, configureCredential } = useTenantApi();

  const [currentStep, setCurrentStep] = useState(1);
  const [createdTenantId, setCreatedTenantId] = useState<string | null>(null);

  const [basicInfo, setBasicInfo] = useState<BasicInformationData>({
    name: "",
    slug: "",
    customDomain: "",
    adminUsername: "",
    adminFirstname: "",
    adminLastname: "",
    adminEmail: "",
    adminPassword: "",
  });

  const [credentials, setCredentials] = useState<MoodleCredentialData>({
    moodleUrl: "",
    adminToken: "",
    proctorToken: "",
  });

  const [configuration, setConfiguration] = useState<TenantConfigurationData>({
    status: "ACTIVE",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [provisioningStatus, setProvisioningStatus] = useState<
    | "idle"
    | "creating_tenant"
    | "configuring_credentials"
    | "success"
    | "partial_success"
    | "error"
  >("idle");
  const [provisioningError, setProvisioningError] = useState<string | null>(
    null,
  );

  const handleNavigateBack = () => {
    router.push(ROUTES.ADMIN.TENANTS);
  };

  const handleBasicInfoChange = (
    field: keyof BasicInformationData,
    value: string,
  ) => {
    setBasicInfo((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleCredentialsChange = (
    field: keyof MoodleCredentialData,
    value: string,
  ) => {
    setCredentials((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => {
      const updated = { ...prev };
      delete updated[field];
      return updated;
    });
  };

  const handleConfigurationChange = (
    field: keyof TenantConfigurationData,
    value: TenantStatus,
  ) => {
    setConfiguration((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!basicInfo.name.trim() || basicInfo.name.trim().length < 2) {
      newErrors.name = "Nama tenant minimal 2 karakter.";
    }
    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (
      !basicInfo.slug ||
      basicInfo.slug.length < 3 ||
      basicInfo.slug.length > 63 ||
      !slugRegex.test(basicInfo.slug)
    ) {
      newErrors.slug =
        "Slug harus 3-63 karakter, huruf kecil, angka, atau tanda hubung.";
    }
    const userRegex = /^[a-z0-9_-]{3,50}$/;
    if (!basicInfo.adminUsername || !userRegex.test(basicInfo.adminUsername)) {
      newErrors.adminUsername =
        "Username admin harus 3-50 karakter (huruf kecil/angka/underscore/hyphen).";
    }
    if (!basicInfo.adminFirstname.trim()) {
      newErrors.adminFirstname = "Nama depan admin wajib diisi.";
    }
    if (!basicInfo.adminLastname.trim()) {
      newErrors.adminLastname = "Nama belakang admin wajib diisi.";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!basicInfo.adminEmail || !emailRegex.test(basicInfo.adminEmail)) {
      newErrors.adminEmail = "Format email tidak valid.";
    }
    if (basicInfo.adminPassword && basicInfo.adminPassword.length < 8) {
      newErrors.adminPassword = "Password minimal 8 karakter.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (credentials.moodleUrl.trim()) {
      try {
        const parsed = new URL(credentials.moodleUrl);
        if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
          newErrors.moodleUrl = "URL harus menggunakan http atau https.";
        }
      } catch {
        newErrors.moodleUrl = "Format URL tidak valid.";
      }
      if (!credentials.adminToken.trim()) {
        newErrors.adminToken =
          "Admin token wajib diisi jika URL Moodle ditentukan.";
      }
    } else if (credentials.adminToken.trim()) {
      newErrors.moodleUrl =
        "Moodle URL wajib diisi jika admin token ditentukan.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!validateStep1()) return;
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!validateStep2()) return;
      setCurrentStep(3);
    } else if (currentStep === 3) {
      setCurrentStep(4);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmitWizard = async () => {
    setProvisioningStatus("creating_tenant");
    setProvisioningError(null);

    // Step A: Create Tenant + Initial Admin
    const createResult = await createTenant({
      slug: basicInfo.slug,
      name: basicInfo.name,
      status: configuration.status,
      customDomain: basicInfo.customDomain || null,
      adminUser: {
        username: basicInfo.adminUsername,
        firstname: basicInfo.adminFirstname,
        lastname: basicInfo.adminLastname,
        email: basicInfo.adminEmail,
        password: basicInfo.adminPassword || undefined,
      },
    });

    if (createResult.error || !createResult.data) {
      setProvisioningStatus("error");
      setProvisioningError(createResult.error ?? "Gagal membuat tenant.");
      return;
    }

    const tenantId = createResult.data.id;
    setCreatedTenantId(tenantId);

    // Step B: Configure Moodle Credentials if provided
    if (credentials.moodleUrl.trim() && credentials.adminToken.trim()) {
      setProvisioningStatus("configuring_credentials");
      const credResult = await configureCredential(tenantId, {
        moodleUrl: credentials.moodleUrl.trim(),
        adminToken: credentials.adminToken.trim(),
        proctorToken: credentials.proctorToken.trim() || null,
        timeoutBudgetMs: 10000,
        sslVerify: true,
      });

      if (credResult.error) {
        setProvisioningStatus("partial_success");
        setProvisioningError(credResult.error);
        return;
      }
    }

    setProvisioningStatus("success");
  };

  const handleRetryCredentialOnly = async () => {
    if (!createdTenantId) return;
    setProvisioningStatus("configuring_credentials");
    setProvisioningError(null);

    const credResult = await configureCredential(createdTenantId, {
      moodleUrl: credentials.moodleUrl.trim(),
      adminToken: credentials.adminToken.trim(),
      proctorToken: credentials.proctorToken.trim() || null,
      timeoutBudgetMs: 10000,
      sslVerify: true,
    });

    if (credResult.error) {
      setProvisioningStatus("partial_success");
      setProvisioningError(credResult.error);
    } else {
      setProvisioningStatus("success");
    }
  };

  const isProvisioning =
    provisioningStatus === "creating_tenant" ||
    provisioningStatus === "configuring_credentials";

  return (
    <section className="mx-auto max-w-3xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Button
          size="sm"
          variant="outline"
          color="secondary"
          iconOnly
          leftIcon={ArrowLeft}
          onClick={handleNavigateBack}
          aria-label="Kembali ke daftar tenant"
          disabled={isProvisioning}
        />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Tambah Tenant Baru
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Wizard terpandu 4 langkah untuk pendaftaran institusi, admin awal,
            dan koneksi Moodle.
          </p>
        </div>
      </div>

      {/* Step Indicator */}
      <TenantWizardStepIndicator
        steps={WIZARD_STEPS}
        currentStep={currentStep}
        onStepClick={(id) => {
          if (!isProvisioning && provisioningStatus === "idle") {
            setCurrentStep(id);
          }
        }}
      />

      {/* Provisioning Status Result Banner */}
      {provisioningStatus !== "idle" && (
        <TenantProvisioningStatus
          status={provisioningStatus}
          errorMessage={provisioningError}
          tenantId={createdTenantId}
          onNavigateToDetail={() => {
            if (createdTenantId) {
              router.push(ROUTES.ADMIN.TENANT_DETAIL(createdTenantId));
            }
          }}
          onRetryCredential={
            credentials.moodleUrl && credentials.adminToken
              ? handleRetryCredentialOnly
              : undefined
          }
        />
      )}

      {/* Wizard Step Body */}
      {provisioningStatus === "idle" && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs space-y-6">
          {currentStep === 1 && (
            <TenantBasicInformationStep
              data={basicInfo}
              onChange={handleBasicInfoChange}
              errors={errors}
            />
          )}

          {currentStep === 2 && (
            <TenantMoodleCredentialStep
              data={credentials}
              onChange={handleCredentialsChange}
              errors={errors}
            />
          )}

          {currentStep === 3 && (
            <TenantConfigurationStep
              data={configuration}
              onChange={handleConfigurationChange}
            />
          )}

          {currentStep === 4 && (
            <TenantReviewStep
              basicInfo={basicInfo}
              credentials={credentials}
              configuration={configuration}
              onEditStep={(id) => setCurrentStep(id)}
            />
          )}

          {/* Wizard Action Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div>
              {currentStep > 1 && (
                <Button
                  variant="outline"
                  color="secondary"
                  onClick={handlePrevStep}
                  type="button"
                >
                  Sebelumnya
                </Button>
              )}
            </div>

            <div>
              {currentStep < 4 ? (
                <Button
                  variant="filled"
                  color="primary"
                  onClick={handleNextStep}
                  rightIcon={ArrowRight}
                  type="button"
                >
                  Lanjut Langkah {currentStep + 1}
                </Button>
              ) : (
                <Button
                  variant="filled"
                  color="primary"
                  onClick={handleSubmitWizard}
                  rightIcon={Check}
                  type="button"
                >
                  Konfirmasi & Buat Tenant
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
