# 🧪 Panduan TDD dan Red-Green-Refactor Tim

Pendekatan *Test-Driven Development* (TDD) wajib diterapkan pada setiap pengerjaan fitur baru maupun penyelesaian rute yang belum dibuat (halaman 404). 

## 🔄 Siklus TDD

### FASE 1: RED (Tulis Tes yang Gagal)
1. Tulis skenario pengujian berdasarkan Kriteria Penerimaan.
2. Buat *unit test* yang menargetkan rute yang belum selesai tersebut.
3. **Kewajiban Sekuritas:** Masukkan skenario otorisasi (RBAC) untuk mencegah kebocoran data.
4. Jalankan tes. Tes **harus gagal** karena rute belum dibuat (masih *error* 404).

### FASE 2: GREEN (Buat Tes Berhasil)
Tulis kode implementasi halaman yang sebenarnya.
1. **PENTING:** Buat file `page.tsx` pada rute yang diminta agar merespons 200 OK. **Jangan** menyelesaikan tes dengan cara membuat halaman *error* `not-found.tsx`.
2. Pasang validasi otorisasi di level komponen atau server.
3. Fokus pada stabilitas fungsional dan keamanan data.

### FASE 3: REFACTOR (Rapikan Kode)
Setelah tes hijau, optimalkan kode halaman yang baru dibuat.
1. Rapikan UI.
2. Hapus *magic strings* atau *hardcode*, gunakan `ROUTES` dari `src/libs/routes.ts`.
3. Pastikan *test* tetap hijau.
