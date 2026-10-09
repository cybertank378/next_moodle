# Audit Branding Aksaventra

Audit ini mencakup implementasi issue GitHub #149.

## Sumber konfigurasi

- Nama platform, deskripsi, dan path aset aktif didefinisikan di `src/libs/branding.ts`.
- `BrandLogo` memilih aset dari `surfaceTone` (`light` atau `dark`), bukan dari tema aplikasi.
- Sidebar saat ini memakai `bg-slate-900`, sehingga desktop expanded dan drawer mobile memakai logo horizontal `on-dark`; desktop collapsed memakai mark `on-dark`.
- Login mobile merender varian berdasarkan permukaan aktual light/dark melalui kelas tema tanpa pembacaan state browser saat hydration.

## Aset aktif

- `aksaventra-logo-on-light.svg` dan fallback PNG.
- `aksaventra-logo-on-dark.svg` dan fallback PNG.
- `aksaventra-mark-on-light.svg` dan fallback PNG.
- `aksaventra-mark-on-dark.svg` dan fallback PNG.
- `favicon.ico` dengan frame 16, 32, dan 48 px.
- `icon.png`, `apple-icon.png`, serta ikon manifest 192 dan 512 px.

Semua SVG memakai path vektor untuk mark dan wordmark, tanpa bitmap yang dibungkus SVG. Seluruh aset memiliki background transparan.

## Hasil pencarian nama dan aset lama

Tidak ada variasi `EduNusa`, `Edunusa`, `EDUNUSA`, `edunusa`, atau `Edu Nusa` pada source aplikasi aktif maupun aset aktif.

Referensi yang tersisa hanya berada pada dokumen issue/migrasi dan dokumen historis di root/scratch. Referensi tersebut dipertahankan karena menjelaskan perubahan dari nama lama dan bukan copy yang ditampilkan kepada pengguna.

Aset lama `logo-dark.png`, `logo-light.png`, dan `logo.png` dihapus setelah seluruh referensi source dimigrasikan. Kandidat metadata ganda `icon0.svg`, `icon1.png`, dan `favicon copy.ico` juga dihapus; Next.js kini memiliki satu file aktif untuk setiap konvensi app icon.

## Tenant branding

Field dan repository branding tenant (`logoUrl`, `faviconUrl`, dan konfigurasi terkait) tidak diubah. Migrasi hanya mengganti fallback/platform branding dan tidak melakukan replace global pada identitas tenant, URL Moodle, credential, identifier database, atau resource deployment.

## Verifikasi

- Tes branding, login, notifikasi, dan integrasi logo sidebar lulus.
- Typecheck lulus.
- Pemeriksaan Biome untuk seluruh file yang diubah lulus.
- Pemeriksaan no-barrel lulus.
- Production build Next.js 16.3.5 lulus dan menghasilkan route metadata untuk `icon.png`, `apple-icon.png`, dan `manifest.webmanifest`.

Full-suite lint dan test masih memiliki kegagalan baseline di area di luar scope branding. Rincian kegagalan dicatat pada handoff implementasi issue.
