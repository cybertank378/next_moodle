# Audit Report: Penggunaan Elemen Native vs Shared UI Components

Dokumen ini merupakan laporan audit dan migrasi menyeluruh dalam penyelesaian Issue #192, yang bertujuan menstandarisasi implementasi antarmuka pengguna di seluruh aplikasi Next.js Exam SaaS menggunakan shared UI components (`src/shared-ui/component/*.tsx`).

---

## 1. Inventarisasi Shared UI Components

Komponen yang diaudit dan tersedia pada `src/shared-ui/component/`:

| Nama Komponen | Kategori | Fitur & Props Utama |
|---|---|---|
| `Button.tsx` | Tombol | Variant (filled, outline, ghost, soft), color, size, loading, disabled, leftIcon, rightIcon, iconOnly |
| `TextField.tsx` | Input Teks | Variant (outlined, filled, custom), size, error, helperText, leftIcon, rightIcon, enablePasswordToggle, counter |
| `SelectField.tsx` | Pilihan Dropdown | Variant, size, error, helperText, label, children options |
| `TextAreaField.tsx` | Input Multi-line | Variant, size, rows, counter, error, helperText |
| `Checkbox.tsx` | Pemilihan (Centang) | Controlled/uncontrolled, indeterminate, label (string/ReactNode), disabled |
| `Radio.tsx` | Pemilihan (Radio) | Controlled/uncontrolled, label (string/ReactNode), disabled, wrapperClassName |
| `Modal.tsx` | Dialog/Overlay | Title, subtitle, size, submit/cancel actions, loading/disabled state |
| `SearchField.tsx` | Pencarian | Input debounced, icon, clearable, size |
| `Table.tsx` | Data Table | `Table`, `TableHead`, `TableBody`, `TableHeaderCell`, `TableRow`, `TableCell` |
| `ToggleGroup.tsx` | Pilihan Tab/Grup | Options list, value, onChange, accessible group container |
| `Badge.tsx` | Feedback / Status | Variant (soft, filled, outline), color, size, icon |
| `Card.tsx` | Kontainer Layout | Border, rounded corners, shadow, backdrop blur, dark/light theme |
| `EmptyState.tsx` | Feedback / Kosong | Title, description, action button, icon |
| `Skeleton.tsx` | Loading Placeholder | Width, height, circle/rounded, count |
| `DatePicker.tsx` | Tanggal | Label, error, helperText, minDate, maxDate, react-datepicker wrapper |

---

## 2. Pemetaan & Migrasi Elemen Native yang Dilakukan

Audit dilakukan ke seluruh folder fitur di `src/sections/**` dan `src/app/**`. Berikut detail migrasi elemen native ke shared UI:

### A. Form Pendaftaran Pengguna (`src/sections/users/organisms/CreateUserModal.tsx`)
- **Sebelum:** Menggunakan native `<input>` untuk username, firstname, lastname, email, password, idnumber, dan native `<select>` untuk role.
- **Sesudah:** Dimigrasikan ke `TextField` dan `SelectField` dengan `enablePasswordToggle` untuk password field.

### B. Import Pengguna CSV (`src/sections/users/organisms/UserImportModal.tsx`)
- **Sebelum:** Menggunakan native `<input>` untuk default password dan native `<textarea>` untuk penempelan teks CSV.
- **Sesudah:** Dimigrasikan ke `TextField` dan `TextAreaField`.

### C. Manajemen Jadwal Tenant (`src/sections/schedule/organisms/TenantScheduleManagementView.tsx`)
- **Sebelum:** Modal penambahan sesi jadwal menggunakan native `<input>`, native `<select>`, dan native `<textarea>`.
- **Sesudah:** Dimigrasikan ke `TextField`, `SelectField`, dan `TextAreaField`.

### D. Panel Jadwal Pengiriman Notifikasi (`src/sections/notification-management/molecules/NotificationSchedulePanel.tsx`)
- **Sebelum:** Menggunakan native `<input type="radio">`.
- **Sesudah:** Dimigrasikan menggunakan komponen `Radio` dari `src/shared-ui/component/Radio.tsx`. Komponen `Radio` diperluas agar mendukung `label: ReactNode` untuk merender deskripsi bertingkat.

### E. Panel Saluran Notifikasi (`src/sections/notification-management/molecules/NotificationChannelPanel.tsx`)
- **Sebelum:** Menggunakan native `<input type="checkbox">` custom styling.
- **Sesudah:** Dimigrasikan menggunakan komponen `Checkbox` dari `src/shared-ui/component/Checkbox.tsx`. Komponen `Checkbox` diperluas agar mendukung `label: ReactNode`.

### F. Filter Kampanye Notifikasi (`src/sections/notification-management/molecules/NotificationCampaignFilters.tsx`)
- **Sebelum:** Input tanggal menggunakan native `<input type="date">` dibungkus div icon manual.
- **Sesudah:** Dimigrasikan menggunakan `TextField` dengan `type="date"` dan properti `leftIcon={Calendar}` serta `rightIcon={ChevronDown}`.

### G. Panel Audiens Notifikasi (`src/sections/notification-management/molecules/NotificationAudiencePanel.tsx`)
- **Sebelum:** Menggunakan native `<select>` untuk tombol dropdown "+ Tambah Peran".
- **Sesudah:** Dimigrasikan menggunakan `SelectField` berukuran `sm`.

### H. Daftar Tugas Siswa (`src/sections/assignments/organisms/StudentAssignmentListView.tsx`)
- **Sebelum:** Menggunakan native `<input>` untuk pencarian dan native `<select>` untuk filter status.
- **Sesudah:** Dimigrasikan ke `SearchField` dan `SelectField`.

### I. Widget Nilai Terbaru Siswa (`src/sections/dashboard/molecules/StudentRecentGrades.tsx`)
- **Sebelum:** Menggunakan native `<table>`, `<thead>`, `<tbody>`, `<tr>`, `<th>`, `<td>`.
- **Sesudah:** Dimigrasikan ke `Table`, `TableHead`, `TableBody`, `TableHeaderCell`, `TableRow`, `TableCell`.

### J. Modal Syarat & Ketentuan (`src/sections/auth/molecules/TermsConditionsModal.tsx`)
- **Sebelum:** Menggunakan native `<input type="checkbox">` persetujuan scroll.
- **Sesudah:** Dimigrasikan ke `Checkbox` dengan label dinamis status scroll.

### K. Filter Toolbar Kalender (`src/sections/calendar/molecules/CalendarFilterToolbar.tsx`)
- **Sebelum:** Tombol mode view ("Bulan" vs "Agenda") menggunakan native `<button>`.
- **Sesudah:** Dimigrasikan ke `ToggleGroup` dengan `options={[{ label: "Bulan", value: "month" }, { label: "Agenda", value: "agenda" }]}`.

---

## 3. Pengecualian Elemen Native yang Dipertahankan & Alasannya

Beberapa elemen native dipertahankan dengan alasan teknis yang kuat:

1. **File Upload Input (`<input type="file" className="hidden">`)**:
   - Lokasi: `UserImportModal.tsx`, `UploadButton.tsx`.
   - Alasan: Native file input yang disembunyikan (`hidden`) dan dipicu oleh tombol/label adalah standar interaksi web untuk pengunggahan file dan tidak mengganggu visual konsistensi antarmuka.
2. **Pilihan Jawaban Ujian (`QuestionCard.tsx`)**:
   - Lokasi: `src/sections/exam/molecules/QuestionCard.tsx`.
   - Alasan: Pilihan ganda, esai, dan isian singkat ujian dioptimalkan untuk kecepatan navigasi keyboard, autosave event handler, dan memiliki styling card spesifik ujian (ringan, tanpa wrapper form tambahan).
3. **Tab Navigasi Khusus Halaman (`CourseDetailView.tsx`, `QuizFilterBar.tsx`)**:
   - Lokasi: `CourseDetailView.tsx`, `QuizFilterBar.tsx`.
   - Alasan: Berperan sebagai tab ARIA semantik (`role="tab"`, `role="tablist"`) yang terikat pada sub-halaman/routing spesifik.
4. **Elemen Semantik & Struktur (`main`, `section`, `header`, `footer`, `nav`, `ul`, `ol`, `li`)**:
   - Alasan: Menjaga struktur dokumen, aksesibilitas screen reader, dan SEO aplikasi.

---

## 4. Hasil Validasi

- **Unit & Integration Test**: 168 file pengujian (840 tests) lulus 100% (`npx vitest run`).
- **TypeScript Typecheck**: Lulus tanpa error (`npx tsc --noEmit --project tsconfig.json`).
- **Next.js Production Build**: Lulus (`npm run build`), seluruh 81 static/dynamic route berhasil digenerate.
- **Linter & Formatting**: Seluruh file yang dimodifikasi telah diformat dan divalidasi dengan Biome.
