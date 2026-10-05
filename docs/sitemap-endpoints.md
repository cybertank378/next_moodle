# 🗺️ Daftar Endpoint URL Valid (Sitemap)

Dokumen ini berisi daftar rute yang valid di dalam aplikasi. Untuk mencegah *typo* yang menghasilkan *error* 404, seluruh navigasi di dalam komponen UI **dilarang menggunakan string manual**. 

Wajib menggunakan *object* konstanta `ROUTES` yang didefinisikan di `src/libs/routes.ts`.

## 📂 Pemetaan Rute (Route Mapping)

### 1. Rute Publik (Public Routes)
- Beranda: `/`

### 2. Rute Autentikasi (Auth Routes)
- Masuk: `/login`
- Daftar: `/register`
- Lupa Kata Sandi: `/forgot-password`
- Ubah Kata Sandi: `/change-password`

### 3. Rute Privat (Protected Routes)
**Dashboard Spesifik Peran:**
- **Admin Dashboard:** `/admin`
- **Tenant Dashboard:** `/tenant`
- **Teacher Dashboard:** `/teacher`
- **Student Dashboard:** `/student`

---
**Cara Penggunaan di Komponen (Untuk Menghindari 404):**
```tsx
import Link from 'next/link';
import { ROUTES } from '@/libs/routes';

// ✅ BENAR
<Link href={ROUTES.PRIVATE.DASHBOARD.STUDENT}>
  Ke Dashboard Siswa
</Link>
```
