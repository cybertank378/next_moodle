# [Feature] Implementasi Design System Baru: Dashboard Dark/White UI

## 📝 Deskripsi
Kita perlu memperbarui dan mengimplementasikan *design system* baru pada proyek Next.js kita berdasarkan desain UI Dashboard terbaru. Fokus utama dari pembaruan ini adalah pembuatan komponen dasar (*base components*), penerapan *design tokens* (warna, tipografi, jarak), dan dukungan penuh untuk mode Terang dan Gelap (*Light/Dark mode*).

## 🎨 Referensi Desain
- **Figma Link**: [Dashboard Design Dark & White UI](https://www.figma.com/community/file/1137451095120799272/dashboard-design-dark-white-ui)

## 📋 Task Checklist

### 1. Setup & Konfigurasi Token
- [ ] Ekstrak *Design Tokens* dari Figma (Colors, Typography, Spacing, Shadows).
- [ ] Konfigurasi file styling utama (misal: `tailwind.config.js` atau file konfigurasi CSS-in-JS).
- [ ] Setup provider untuk tema *Dark/Light mode* (rekomendasi: gunakan `next-themes`).

### 2. Base Components (Atom & Molekul)
- [ ] Buat komponen `Button` dengan varian (Primary, Secondary, Outline, Danger) beserta status (Hover, Active, Disabled).
- [ ] Buat komponen `Input` (Text, Password, Search, Dropdown) dengan *error state*.
- [ ] Buat komponen `Card` untuk menampung widget dashboard.
- [ ] Buat komponen `Typography` (Heading, Subheading, Body Text) sesuai hirarki Figma.

### 3. Layout Components (Organisme)
- [ ] Buat komponen `Sidebar` (Navigasi Kiri) yang responsif.
- [ ] Buat komponen `Header/Navbar` atas (termasuk tombol *toggle* tema dan profil).
- [ ] Konfigurasi struktur `layout.tsx` utama untuk menyatukan Sidebar, Header, dan Content Area.

### 4. Integrasi & Refactoring
- [ ] Terapkan layout dan komponen baru ke halaman Dashboard utama.
- [ ] Hapus *styling* lama yang sudah tidak digunakan (bersihkan *technical debt*).
- [ ] Pastikan tidak ada *Flash of Unstyled Text* (FOUT) saat memuat tema.

## ✅ Acceptance Criteria (Kriteria Selesai)
- [ ] Semua komponen UI merender dengan sempurna sesuai dengan jarak (padding/margin) dan warna di Figma.
- [ ] *Toggle* untuk berpindah dari mode Gelap ke Terang berfungsi dengan baik tanpa *lag* atau kedipan warna yang salah.
- [ ] Komponen bersifat *reusable* dan menerima *props* standar React (seperti `className`, `onClick`, dll).
- [ ] Responsif di perangkat *mobile*, *tablet*, dan *desktop*.

## 🏷️ Labels
`enhancement`, `design-system`, `ui/ux`, `frontend`