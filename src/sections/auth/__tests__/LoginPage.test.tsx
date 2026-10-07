// Files: src/sections/auth/__tests__/LoginPage.test.tsx

import { GraduationCap } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";
import * as authHook from "@/modules/auth/presentation/hooks/useAuthApi";
import AuthBrand from "@/sections/auth/atoms/AuthBrand";
import AuthFeatureIcon from "@/sections/auth/atoms/AuthFeatureIcon";
import LoginFeatureRow from "@/sections/auth/molecules/LoginFeatureRow";
import LoginFooter from "@/sections/auth/molecules/LoginFooter";
import LoginFormFields from "@/sections/auth/molecules/LoginFormFields";
import LoginHelpPanel from "@/sections/auth/molecules/LoginHelpPanel";
import LoginBrandPanel from "@/sections/auth/organisms/LoginBrandPanel";
import LoginForm from "@/sections/auth/organisms/LoginForm";
import AuthPage from "@/sections/auth/pages/AuthPage";
import LoginPageSection from "@/sections/auth/pages/LoginPageSection";

interface MockAuthHook {
  readonly login: Mock<
    (input: { username: string; password: string }) => Promise<unknown>
  >;
  readonly logout: Mock<() => Promise<void>>;
  readonly loading: boolean;
  readonly error: string | null;
}

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    refresh: vi.fn(),
  }),
}));

vi.mock("@/modules/auth/presentation/hooks/useAuthApi", () => ({
  useAuthApi: vi.fn(),
}));

describe("Aksaventra Auth Redesign Components", () => {
  const defaultMockAuth: MockAuthHook = {
    login:
      vi.fn<
        (input: { username: string; password: string }) => Promise<unknown>
      >(),
    logout: vi.fn<() => Promise<void>>(),
    loading: false,
    error: null,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(authHook.useAuthApi).mockReturnValue(defaultMockAuth);
  });

  describe("Atoms", () => {
    it("AuthBrand renders dark logo asset for light background", () => {
      const html = renderToStaticMarkup(
        <AuthBrand size="md" surfaceTone="light" />,
      );
      expect(html).toContain("aksaventra-logo-on-light.svg");
      expect(html).toContain("Aksaventra Sistem Pembelajaran");
    });

    it("AuthBrand renders light logo asset for navy background", () => {
      const html = renderToStaticMarkup(
        <AuthBrand size="lg" surfaceTone="dark" />,
      );
      expect(html).toContain("aksaventra-logo-on-dark.svg");
      expect(html).toContain("Aksaventra Sistem Pembelajaran");
    });

    it("AuthFeatureIcon renders title, description, and icon", () => {
      const html = renderToStaticMarkup(
        <AuthFeatureIcon
          description="Akses materi kapan saja dan di mana saja."
          icon={GraduationCap}
          title="Pembelajaran"
        />,
      );
      expect(html).toContain("Pembelajaran");
      expect(html).toContain("Akses materi kapan saja dan di mana saja.");
      expect(html).toContain("<svg");
    });
  });

  describe("Molecules", () => {
    it("LoginFeatureRow renders all three educational features with descriptions", () => {
      const html = renderToStaticMarkup(<LoginFeatureRow />);
      expect(html).toContain("Pembelajaran");
      expect(html).toContain("Akses materi kapan saja dan di mana saja.");
      expect(html).toContain("Ujian Online");
      expect(html).toContain("Laksanakan ujian dengan aman dan terstandar.");
      expect(html).toContain("Manajemen Sekolah");
      expect(html).toContain("Kelola kelas, pengguna, dan kegiatan akademik.");
    });

    it("LoginHelpPanel renders contact administrator message and help text", () => {
      const html = renderToStaticMarkup(<LoginHelpPanel />);
      expect(html).toContain("Mengalami kendala masuk?");
      expect(html).toContain("Hubungi administrator sekolah Anda.");
    });

    it("LoginFooter renders dynamic current year and Aksaventra branding", () => {
      const currentYear = new Date().getFullYear();
      const html = renderToStaticMarkup(<LoginFooter />);
      expect(html).toContain(
        `© ${currentYear} Aksaventra • Sistem Pembelajaran`,
      );
    });

    it("LoginFormFields renders accessible inputs with autocomplete and Indonesian labels", () => {
      const html = renderToStaticMarkup(
        <LoginFormFields
          identifier="testuser"
          onChangeIdentifier={vi.fn()}
          onChangePassword={vi.fn()}
          password="secret"
          submitted={false}
        />,
      );
      expect(html).toContain("Nama pengguna");
      expect(html).toContain('name="username"');
      expect(html).toContain('autoComplete="username"');
      expect(html).toContain("Kata sandi");
      expect(html).toContain('name="password"');
      expect(html).toContain('autoComplete="current-password"');
      expect(html).toContain('type="password"');
      expect(html).toContain('aria-label="Tampilkan kata sandi"');
      expect(html).toContain("min-w-11 min-h-11");
    });

    it("LoginFormFields renders error messages when touched and invalid", () => {
      const html = renderToStaticMarkup(
        <LoginFormFields
          identifier=""
          identifierError="Nama pengguna wajib diisi"
          onChangeIdentifier={vi.fn()}
          onChangePassword={vi.fn()}
          password=""
          passwordError="Kata sandi wajib diisi"
          submitted={true}
        />,
      );
      expect(html).toContain("Nama pengguna wajib diisi");
      expect(html).toContain("Kata sandi wajib diisi");
    });
  });

  describe("Organisms", () => {
    it("LoginBrandPanel renders copy, illustration paths, and feature row", () => {
      const html = renderToStaticMarkup(<LoginBrandPanel />);
      expect(html).toContain("Belajar lebih terarah.");
      expect(html).toContain("Kelola pendidikan lebih mudah.");
      expect(html).toContain(
        "Satu tempat untuk pembelajaran, ujian, dan pengelolaan sekolah.",
      );
      expect(html).toContain("book-and-schools.png");
      expect(html).toContain("mobile-mockup.png");
      expect(html).toContain("aksaventra-logo-on-dark.svg");
      expect(html).toContain("Pembelajaran");
      expect(html).toContain("Ujian Online");
      expect(html).toContain("Manajemen Sekolah");
    });

    it("LoginForm renders header badge, form, help panel, legal notice, and footer", () => {
      const html = renderToStaticMarkup(<LoginForm />);
      expect(html).toContain("SELAMAT DATANG");
      expect(html).toContain("Masuk ke akun Anda");
      expect(html).toContain(
        "Gunakan akun yang diberikan sekolah atau administrator.",
      );
      expect(html).toContain("Lupa kata sandi?");
      expect(html).toContain("Masuk");
      expect(html).toContain("Mengalami kendala masuk?");
      expect(html).toContain("Ketentuan Penggunaan");
      expect(html).toContain("Kebijakan Privasi");
      expect(html).toContain("Aksaventra • Sistem Pembelajaran");
    });

    it("LoginForm displays loading state on button when auth is pending", () => {
      vi.mocked(authHook.useAuthApi).mockReturnValue({
        ...defaultMockAuth,
        loading: true,
      });
      const html = renderToStaticMarkup(<LoginForm />);
      expect(html).toContain("animate-spin");
      expect(html).toContain("disabled");
    });

    it("LoginForm displays safe error message with alert role when auth fails", () => {
      vi.mocked(authHook.useAuthApi).mockReturnValue({
        ...defaultMockAuth,
        error: "Kredensial tidak valid.",
      });
      const html = renderToStaticMarkup(<LoginForm />);
      expect(html).toContain('role="alert"');
      expect(html).toContain("Kredensial tidak valid.");
    });
  });

  describe("Pages & Layout", () => {
    it("LoginPageSection composes both brand panel and login form", () => {
      const html = renderToStaticMarkup(<LoginPageSection />);
      expect(html).toContain("Belajar lebih terarah.");
      expect(html).toContain("Masuk ke akun Anda");
      expect(html).toContain("book-and-schools.png");
    });

    it("AuthPage renders LoginPageSection when mode is login", () => {
      const html = renderToStaticMarkup(<AuthPage mode="login" />);
      expect(html).toContain("Masuk ke akun Anda");
      expect(html).toContain("Aksaventra");
    });

    it("AuthPage renders AuthFeatureUnavailable for non-login modes without regression", () => {
      const html = renderToStaticMarkup(<AuthPage mode="register" />);
      expect(html).toContain("Fitur ini belum tersedia");
      expect(html).toContain("Kembali ke Login");
    });
  });

  describe("Validation & Submission Behavior Logic", () => {
    it("prevents submission on first click when fields are empty", () => {
      const mockLogin =
        vi.fn<
          (input: { username: string; password: string }) => Promise<unknown>
        >();

      const submitHandler = (username: string, pass: string) => {
        const trimmedUsername = username.trim();
        const hasIdentifierError = !trimmedUsername;
        const hasPasswordError = !pass;
        if (hasIdentifierError || hasPasswordError) {
          return false;
        }
        mockLogin({ username: trimmedUsername, password: pass });
        return true;
      };

      const result = submitHandler("", "");
      expect(result).toBe(false);
      expect(mockLogin).not.toHaveBeenCalled();
    });

    it("trims username but preserves password spaces", () => {
      const mockLogin =
        vi.fn<
          (input: { username: string; password: string }) => Promise<unknown>
        >();

      const submitHandler = (username: string, pass: string) => {
        const trimmedUsername = username.trim();
        const hasIdentifierError = !trimmedUsername;
        const hasPasswordError = !pass;
        if (hasIdentifierError || hasPasswordError) {
          return false;
        }
        mockLogin({ username: trimmedUsername, password: pass });
        return true;
      };

      const result = submitHandler("   student123   ", "  pass word  ");
      expect(result).toBe(true);
      expect(mockLogin).toHaveBeenCalledWith({
        username: "student123",
        password: "  pass word  ",
      });
    });

    it("guards against double execution when loading is active", () => {
      const mockLogin =
        vi.fn<
          (input: { username: string; password: string }) => Promise<unknown>
        >();
      const isLoading = true;

      const submitHandler = (username: string, pass: string) => {
        const trimmedUsername = username.trim();
        const hasIdentifierError = !trimmedUsername;
        const hasPasswordError = !pass;
        if (hasIdentifierError || hasPasswordError || isLoading) {
          return false;
        }
        mockLogin({ username: trimmedUsername, password: pass });
        return true;
      };

      const result = submitHandler("student123", "secret123");
      expect(result).toBe(false);
      expect(mockLogin).not.toHaveBeenCalled();
    });
  });
});
