## Summary

Closes #145

This PR redesigns and aligns the Notification Management pages ("Pengelolaan Notifikasi" and "Buat Pengumuman") strictly with the mockups and specs provided by the user, incorporating authentic **Aksaventra** design identity, rich aesthetics, and atomic UI architecture.

### Key Changes
1. **Mockup 1 — Pengelolaan Notifikasi (List View)**
   - **Header**: Breadcrumb (`Aksaventra / Admin Platform / Pengelolaan Notifikasi`), title, subtitle, refresh button (`RefreshCw`), and solid vibrant blue `+ Buat Pengumuman` button without superfluous borders.
   - **4 Summary Cards**:
     - `Total Pengumuman` (24, `FileText` in circular light-blue background)
     - `Terkirim` (18, `Send` in circular light-blue background)
     - `Terjadwal` (4, `Calendar` in circular light-blue background)
     - `Draft` (2, `FileText` in circular light-blue background)
   - **Section "Data contoh"**:
     - Tab status: `Semua 24`, `Terkirim 18`, `Terjadwal 4`, `Draft 2`, `Arsip` with active blue underline and count pills.
     - Filter toolbar: Search input (`Cari judul pengumuman...`), `Semua Kanal ∨`, `Semua Tenant ∨`, and `📅 Pilih tanggal ∨`.
     - Data table:
       - Icons per category (`FileText`, `Calendar`, `Megaphone`) in rounded light-blue squares.
       - Columns: `Pengumuman`, `Audiens`, `Kanal`, `Status`, `Waktu`, `Aksi`.
       - Soft sky pill badges (`Inbox`, `Push`).
       - Status badges (`✔ Terkirim`, `⏱ Terjadwal`, `📄 Draft`).
       - Square button pagination: `<` `1` `2` `3` `>`.
   - **Section "Tampilan saat belum ada pengumuman"**:
     - Cloud + dotted loop trajectory + blue paper plane vector illustration.
     - Headline: `Belum ada pengumuman`, subtext: `Mulai buat pengumuman untuk tenant Anda.`.
     - Outline button: `+ Buat Pengumuman`.

2. **Mockup 2 — Buat Pengumuman (Form View)**
   - **Header**: Breadcrumb (`Admin / Pengelolaan Notifikasi`), `← Kembali`, category label `PENGELOLAAN NOTIFIKASI`, title `Buat Pengumuman`, subtitle `Susun pesan dan tentukan penerima dengan mudah.`.
   - **Top Actions**: Status badge `● Draft` `Draft disimpan secara manual`, buttons `Pratinjau`, `Simpan Draft`, `Kirim Sekarang`.
   - **Left Column**:
     - Card `Konten Pengumuman` (pencil icon).
     - Field `Judul Pengumuman` ("Informasi Jadwal Ujian Tengah Semester").
     - Field `Isi Pengumuman` (Tiptap Rich Text Editor with full formatting toolbar, character count "284 karakter").
     - Field `Ringkasan Push` ("Jadwal ujian tersedia. Silakan periksa akun Anda.").
     - Inner banner `Pratinjau Push` with Aksaventra app icon emblem.
   - **Right Column**:
     - Card `Audiens` (`Tenant terpilih`, `SMP Hangtuah 2 Jakarta`, interactive removable chips `👤 Siswa ✕` & `👤 Guru ✕`, `Hitung Penerima` button, `● Belum dihitung` indicator).
     - Card `Saluran Pengiriman` (`Inbox Aplikasi`, `Push Notifikasi`).
     - Card `Waktu Pengiriman` (`Kirim sekarang`, `Jadwalkan`).
     - Alert box: `Periksa sebelum mengirim` ("Pastikan isi pesan dan audiens sudah sesuai.").
     - Footer note: `Pratinjau desain • Konten ilustrasi.`.

3. **Engineering Integrity**:
   - Zero `any` anywhere (strict typing across all domain, use cases, controller, and UI).
   - All files prefixed with `// Files: <path>` on line 1.
   - All unit tests pass: 20/20 UI tests, 105/105 notification module tests.
   - `npm run typecheck` (`tsc --noEmit`) passes with 0 errors.
   - `npm run lint:barrel` passes with 0 barrel violations.
   - Production build `npm run build` succeeds cleanly.
