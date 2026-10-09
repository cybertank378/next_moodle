# Requirement & Skills: Implementasi Design System Next.js

Dokumen ini mendefinisikan daftar keahlian, konsep, dan teknologi yang relevan dan dibutuhkan untuk menyelesaikan migrasi *design system* "Dashboard Dark & White UI".

## 🛠️ Tech Stack Utama
- **Framework**: Next.js (App Router atau Pages Router, disesuaikan dengan versi proyek saat ini).
- **Library UI**: React.js.
- **Styling**: Tailwind CSS (sangat disarankan untuk mempercepat pembuatan utilitas *dark mode*) atau CSS Modules / Styled-components.
- **Theme Manager**: `next-themes` (untuk mengelola *state* dark/light mode dan sinkronisasi dengan *system preference* pengguna).
- **Icons**: Lucide React atau Heroicons (disesuaikan dengan aset ikon di Figma).

## 🧠 Konsep & Keahlian yang Dibutuhkan

### 1. CSS & Theming Strategy
- Memahami konsep **Design Tokens** (mengubah variabel desain Figma seperti `primary-500` menjadi variabel CSS atau konfigurasi Tailwind).
- Menguasai implementasi **Dark Mode** (menggunakan selektor `.dark` di Tailwind atau manipulasi variabel CSS di root `<html>`).
- Pemahaman tentang pencegahan *hydration mismatch* saat merender tema dari `localStorage` di Next.js (Server-Side Rendering vs Client-Side).

### 2. Component-Driven Development (CDD)
- Mampu memecah desain Figma yang kompleks menjadi komponen-komponen kecil (*Atomic Design*: Atoms, Molecules, Organisms).
- Keahlian dalam mendesain API komponen React (*Props design*). Contoh: Membuat varian tombol menggunakan `cva` (Class Variance Authority) atau manipulasi *string template*.

### 3. Ekstraksi Desain Figma
- Kemampuan membaca panel *Inspect* (Properties) di Figma.
- Mengonversi nilai absolut (px) ke nilai relatif (rem) untuk mendukung aksesibilitas yang baik.
- Memahami *Auto Layout* di Figma dan menerjemahkannya ke Flexbox atau CSS Grid.

### 4. Next.js Specifics
- Mampu mengintegrasikan *Design System* dengan ekosistem Next.js (misalnya menggunakan komponen `<Link />` milik Next.js di dalam komponen *Button* atau *Navbar* desain sistem).
- Optimasi pemuatan *font* (menggunakan `next/font`).