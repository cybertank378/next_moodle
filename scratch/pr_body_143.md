## Ringkasan Perubahan

Pull Request ini mengimplementasikan redesign halaman login **Aksaventra** sesuai spesifikasi dan mockup visual pada Issue #143.

### 1. Branding & Aset Visual (`Aksaventra - Sistem Pembelajaran`)
- Menggunakan logo resmi:
  - `public/assets/images/logo/logo-light.png` untuk latar navy pada panel kiri desktop.
  - `public/assets/images/logo/logo-dark.png` untuk latar terang / form login dan tampilan mobile.
  - `public/assets/images/logo/logo.png`.
- Menggunakan ilustrasi dan mockup resmi:
  - `public/assets/images/ilustrator/book-and-schools.png` sebagai ilustrasi 3D utama (buku, podium, kartu kaca, topi wisuda).
  - `public/assets/images/ilustrator/mobile-mockup.png` untuk floating preview mobile mockup dengan badge "Mobile" pada panel kiri desktop.

### 2. Struktur Atomic Design (`src/sections/auth/`)
- **Atoms**:
  - `AuthBrand.tsx`: Merender logo resmi Aksaventra (`logo-light.png` / `logo-dark.png`) dengan rasio dan ketajaman yang presisi.
  - `AuthFeatureIcon.tsx`: Menampilkan icon box bernuansa biru dengan judul tebal dan deskripsi spesifik.
  - `AuthTextField.tsx`: Reusable input field yang terintegrasi dengan aksesibilitas dan `TextField` shared-ui.
- **Molecules**:
  - `LoginFormFields.tsx`: Field input dengan label bahasa Indonesia: **Nama pengguna** dan **Kata sandi**, lengkap dengan autocomplete (`username`, `current-password`) dan password visibility toggle.
  - `LoginHelpPanel.tsx`: Kartu bantuan dengan avatar icon `?`: *"Mengalami kendala masuk? Hubungi administrator sekolah Anda."*
  - `LoginFeatureRow.tsx`: 3 kartu fitur edukasi:
    1. *Pembelajaran*: "Akses materi kapan saja dan di mana saja."
    2. *Ujian Online*: "Laksanakan ujian dengan aman dan terstandar."
    3. *Manajemen Sekolah*: "Kelola kelas, pengguna, dan kegiatan akademik."
  - `LoginFooter.tsx`: Hak cipta tahun dinamis: `© {currentYear} Aksaventra • Sistem Pembelajaran`.
- **Organisms**:
  - `LoginBrandPanel.tsx`: Panel kiri desktop berlatar gradien royal navy (`#061743` s/d `#0A266F`) dengan headline *"Belajar lebih terarah. Kelola pendidikan lebih mudah."*, deskripsi, komposisi ilustrasi 3D + mobile preview, dan 3 kartu fitur.
  - `LoginForm.tsx`: Organism form dengan badge **SELAMAT DATANG**, judul *"Masuk ke akun Anda"*, field Nama pengguna & Kata sandi, tautan *"Lupa kata sandi?"*, tombol **Masuk →** (dengan icon panah), kartu bantuan, pernyataan persetujuan Ketentuan Penggunaan & Kebijakan Privasi, serta footer.
- **Pages**:
  - `LoginPageSection.tsx`: Menyusun layout responsif 55:45 (desktop dua panel, mobile full-width terfokus pada form dan logo).
  - `AuthPage.tsx`: Me-route mode `login` ke `LoginPageSection`, dan mempertahankan mode lainnya tanpa regresi.

### 3. Logika & Kualitas Kode
- **Fix First-Click Validation**: Evaluasi validasi input langsung secara sinkron pada `handleSubmit` sebelum memanggil `auth.login` (mencegah form kosong lolos pada klik pertama).
- **Sanitasi Input**: Username di-trim otomatis; kata sandi tidak di-trim untuk menjaga spasi yang sah.
- **Guard Request Ganda**: Pencegahan submit berulang saat status `auth.loading` sedang aktif.
- **Zero `any`**: Tidak ada penggunaan tipe `any` sama sekali (`: any`, `as any`, `<any>`) di seluruh kode implementasi maupun suite pengujian `LoginPage.test.tsx`.
- **Aksesibilitas Password Toggle**: Menggunakan accessible name `aria-label`, target sentuh minimum 44px, dan `tabIndex={0}`.

## Hasil Pengujian & Verifikasi
- ✅ **Unit & Integration Tests**: 20/20 test lulus (`LoginPage.test.tsx` dan `authSectionModuleBoundary.test.ts`).
- ✅ **TypeScript Typecheck**: `tsc --noEmit` lolos 0 error.
- ✅ **Biome Linter**: `npx biome check src/sections/auth` lolos 0 error.
- ✅ **Barrel Export Check**: `npm run lint:barrel` lolos tanpa export barrel terlarang.
- ✅ **Production Build**: `npm run build` sukses mengompilasi halaman `/login` statis (Next.js 16 Turbopack).

Closes #143
