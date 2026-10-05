# 📚 Dokumentasi Routing Framework

Sistem ini menggunakan konvensi *routing* berbasis sistem file (File-System Based Routing) dengan arsitektur App Router (Next.js). Dokumen ini menjadi acuan agar tidak terjadi kesalahan pemanggilan URL yang memicu *error* 404.

## 1. Konvensi Struktur Folder & File
Setiap rute direpresentasikan oleh folder di dalam direktori `app/`. UI untuk rute tersebut didefinisikan di dalam file `page.tsx`.

## 2. Navigasi Antar Halaman (Menggunakan useRouter)
Untuk navigasi programmatis, wajib menggunakan `useRouter` dan konstanta dari `src/libs/routes.ts`.

```tsx
'use client'; 

import { useRouter } from 'next/navigation';
import { ROUTES } from '@/libs/routes';

export default function SubmitButton() {
  const router = useRouter();

  const handleSimpanData = async () => {
    try {
      // ✅ BENAR: Navigasi menggunakan konstanta rute terpusat
      router.push(ROUTES.PRIVATE.DASHBOARD.ADMIN);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <button onClick={handleSimpanData} className="btn-primary">
      Simpan
    </button>
  );
}
```

## 3. Proteksi Rute
Semua rute di bawah `/dashboard`, `/admin`, `/tenant`, `/teacher`, atau `/student` wajib memiliki proteksi otorisasi RBAC.
