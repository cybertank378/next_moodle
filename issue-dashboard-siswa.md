# Issue Plan — Student Dashboard SD / SMP / SMA/SMK

## Tujuan
Membangun dashboard utama untuk **role siswa** pada `next_moodle` branch `development`, khusus untuk:
- SD
- SMP
- SMA
- SMK

Dashboard harus menggunakan konteks sekolah, bukan perguruan tinggi.

## Terminologi
| Jangan gunakan | Gunakan |
|---|---|
| Mata Kuliah | Mata Pelajaran |
| Dosen | Guru |
| Mahasiswa | Siswa |
| Course | Kelas / Mata Pelajaran |
| Assignment | Tugas |
| Gradebook | Nilai |
| Academic Calendar | Kalender Akademik |
| Lecturer | Guru |
| University | Sekolah |
| Fakultas | Jurusan/Program Keahlian jika relevan |

---

## Issue #1 — Audit Repository
- [ ] Audit framework, routing, authentication, role-based access.
- [ ] Audit component library dan styling.
- [ ] Audit API/data fetching dan integrasi Moodle.
- [ ] Cari dashboard dan komponen existing.
- [ ] Identifikasi endpoint Moodle yang sudah digunakan.
- [ ] Reuse komponen existing dan hindari duplikasi.

**Acceptance:** struktur project terdokumentasi dan tidak ada perubahan API tanpa kebutuhan.

## Issue #2 — Student Dashboard Route & Access
- [ ] Route dashboard siswa.
- [ ] Redirect login berdasarkan role.
- [ ] Pastikan dashboard guru/admin tidak rusak.
- [ ] Authorization server-side.

**Acceptance:** siswa hanya melihat data yang memang boleh diakses.

## Issue #3 — Dashboard Layout
Desktop:
`Header | Sidebar | Main Content | Right Rail`

Tablet:
`Header | Collapsed Sidebar | Main Content`

Mobile:
`Header | Main Content | Bottom Navigation`

- [ ] Responsive layout.
- [ ] Reuse layout existing.

## Issue #4 — Student Header & Profile
Data:
- nama
- avatar
- kelas
- sekolah
- jenjang
- tahun pelajaran

Contoh:
`Selamat pagi, Andi 👋`
`Kelas 6A • SD Negeri Contoh • Tahun Pelajaran 2026/2027`

- [ ] Data dinamis.
- [ ] Profile dropdown.
- [ ] Tidak ada nama hardcoded.

## Issue #5 — Quick Actions
SD:
`Mata Pelajaran | Tugas | Kalender | Nilai`

SMP/SMA/SMK:
`Mata Pelajaran | Tugas | Kalender | Nilai | Pengumuman`

- [ ] Responsive.
- [ ] Permission-aware.

## Issue #6 — Summary Cards
- [ ] Jumlah mata pelajaran.
- [ ] Tugas belum selesai.
- [ ] Deadline minggu ini.
- [ ] Progress belajar.

Contoh:
`10 Mata Pelajaran | 4 Tugas | 2 Deadline | 76% Progress`

## Issue #7 — Mata Pelajaran
Course card harus menampilkan:
- nama mata pelajaran
- guru
- progress
- jumlah aktivitas
- aktivitas terakhir
- tombol `Lanjut Belajar`

Contoh:
`Matematika — Guru: Ibu Siti — Progress 78%`

UI wajib menggunakan **Mata Pelajaran**, bukan Mata Kuliah.

## Issue #8 — Tugas & Deadline
Status:
- [ ] Terlambat
- [ ] Hari Ini
- [ ] Besok
- [ ] Minggu Ini
- [ ] Mendatang
- [ ] Selesai

Data:
- mata pelajaran
- guru
- tugas
- deadline
- status pengumpulan
- link detail

## Issue #9 — Kalender Siswa
Event:
- Pelajaran
- Tugas
- Ujian
- Kuis
- Kegiatan Sekolah
- Libur
- Event

- [ ] Mini calendar di dashboard.
- [ ] Full calendar `/calendar`.
- [ ] Month/week/day.
- [ ] Today.
- [ ] Previous/next.
- [ ] Filter event.
- [ ] Detail event.
- [ ] Integrasi deadline tugas dan ujian.

## Issue #10 — Jadwal Pelajaran
Contoh:
```text
07:00 Matematika — Ruang 6A
08:30 Bahasa Indonesia — Ruang 6A
10:00 IPA — Lab IPA
```

- [ ] Jadwal hari ini.
- [ ] Guru.
- [ ] Ruang.
- [ ] Jam mulai/selesai.
- [ ] Indikator pelajaran yang sedang berlangsung.

## Issue #11 — Nilai
- [ ] Nilai terbaru.
- [ ] Detail nilai.
- [ ] Feedback.
- [ ] Filter mata pelajaran.
- [ ] Riwayat nilai.

Contoh:
`Matematika — Ulangan Bab 3 — 88/100`

## Issue #12 — Progress Belajar
Contoh:
```text
Matematika       █████████████░░ 80%
IPA              ███████████░░░░ 70%
Bahasa Indonesia ██████████████░ 85%
```

- [ ] Overall progress.
- [ ] Progress per mata pelajaran.
- [ ] Completion percentage.
- [ ] Aktivitas selesai/belum selesai.

Untuk SD, gunakan visual yang lebih sederhana.

## Issue #13 — Lanjut Belajar
- [ ] Mata pelajaran terakhir.
- [ ] Aktivitas terakhir.
- [ ] Aktivitas berikutnya.
- [ ] Tombol `Lanjutkan`.

## Issue #14 — Pengumuman
Jenis:
- Sekolah
- Kelas
- Mata Pelajaran
- Guru

- [ ] List pengumuman.
- [ ] Read/unread.
- [ ] Detail.
- [ ] Author.
- [ ] Timestamp.
- [ ] Attachment indicator.

## Issue #15 — Notifikasi
Jenis:
- Tugas
- Nilai
- Pengumuman
- Pesan
- Kalender
- Sistem

- [ ] Badge unread.
- [ ] Dropdown.
- [ ] Mark as read.
- [ ] Mark all as read.
- [ ] Navigasi ke sumber notifikasi.

## Issue #16 — Aktivitas Terbaru
Contoh:
```text
10:30 Kamu menyelesaikan latihan Matematika.
09:15 Kamu mengumpulkan Tugas IPA.
Kemarin Nilai Bahasa Indonesia tersedia.
```

- [ ] Timeline.
- [ ] Timestamp.
- [ ] Activity type.
- [ ] Link aktivitas.

## Issue #17 — Fitur Khusus SMK
Fitur optional:
- Program Keahlian
- Kompetensi Keahlian
- Praktik
- Project
- PKL
- Sertifikasi

- [ ] Hanya tampil untuk SMK.
- [ ] Configurable.
- [ ] Reuse data Moodle.

## Issue #18 — Empty States
Buat empty state untuk:
- [ ] Tidak ada tugas.
- [ ] Tidak ada jadwal.
- [ ] Tidak ada nilai.
- [ ] Tidak ada pengumuman.
- [ ] Tidak ada mata pelajaran.

Contoh:
`🎉 Tidak ada tugas yang harus dikerjakan. Kamu sudah menyelesaikan semua tugas.`

## Issue #19 — Loading State
- [ ] Skeleton header.
- [ ] Summary.
- [ ] Mata pelajaran.
- [ ] Tugas.
- [ ] Kalender.
- [ ] Nilai.
- [ ] Loading per section.

Satu API lambat tidak boleh membuat seluruh dashboard blank.

## Issue #20 — Error State
Contoh:
`Kalender tidak dapat dimuat. [Coba Lagi]`

- [ ] Error per widget.
- [ ] Retry.
- [ ] Pesan ramah pengguna.

## Issue #21 — Responsive Mobile
Urutan mobile:
`Header → Greeting → Quick Actions → Summary → Tugas → Jadwal → Lanjut Belajar → Mata Pelajaran → Kalender → Nilai → Pengumuman → Aktivitas`

- [ ] Mobile header.
- [ ] Drawer/bottom navigation.
- [ ] Single-column cards.
- [ ] Touch-friendly controls.
- [ ] Mobile calendar.

## Issue #22 — Accessibility
- [ ] Keyboard navigation.
- [ ] Focus state.
- [ ] Semantic headings.
- [ ] Accessible buttons.
- [ ] ARIA bila diperlukan.
- [ ] Calendar keyboard support.
- [ ] Screen-reader friendly status.
- [ ] Contrast memadai.
- [ ] Status tidak hanya dibedakan berdasarkan warna.

## Issue #23 — Moodle Data Integration
| Dashboard | Moodle |
|---|---|
| Mata Pelajaran | Course |
| Tugas | Assignment |
| Kalender | Calendar Event |
| Nilai | Grade |
| Pengumuman | Forum/Announcement |
| Progress | Completion |
| Aktivitas | Course Activity |
| Pesan | Messaging |

- [ ] Reuse API layer existing.
- [ ] Verify student permissions.
- [ ] Fetch authorized data saja.
- [ ] Jangan expose Moodle token.

## Issue #24 — Data Fetching & Performance
- [ ] Parallel fetch widget independen.
- [ ] Cache data.
- [ ] Lazy-load komponen berat.
- [ ] Optimize gambar.
- [ ] Jangan load seluruh history calendar.
- [ ] Pagination untuk list panjang.
- [ ] Hindari unnecessary re-render.

## Issue #25 — Education-Level Configuration
Gunakan:
```ts
type EducationLevel = 'SD' | 'SMP' | 'SMA' | 'SMK'
```

Perilaku:
- **SD:** fokus tugas, jadwal, aktivitas sederhana.
- **SMP:** tugas, nilai, progress, kalender.
- **SMA:** tugas, ujian, nilai, agenda.
- **SMK:** fitur SMA + praktik/project/PKL bila tersedia.

- [ ] Jenjang berasal dari data sekolah/user.
- [ ] Tidak hardcode.
- [ ] Feature visibility configurable.

## Issue #26 — Testing
Component:
- [ ] Greeting.
- [ ] Summary.
- [ ] Subject card.
- [ ] Assignment.
- [ ] Calendar event.
- [ ] Grade.
- [ ] Announcement.
- [ ] Empty/loading/error.

Integration:
`Login siswa → Dashboard → Mata Pelajaran → Tugas → Kalender → Detail Tugas`

Role:
- [ ] SD
- [ ] SMP
- [ ] SMA
- [ ] SMK
- [ ] Guru
- [ ] Admin

## Issue #27 — Visual QA
Viewport:
`1440px, 1280px, 1024px, 768px, 390px`

- [ ] Tidak overflow.
- [ ] Card tidak terpotong.
- [ ] Calendar usable.
- [ ] Text terbaca.
- [ ] Button mudah disentuh.
- [ ] Mobile navigation tidak menutupi content.

## Issue #28 — Security Review
- [ ] Server-side authorization.
- [ ] Validasi akses siswa.
- [ ] Jangan percaya role dari client.
- [ ] Sanitize rich text.
- [ ] Lindungi data pribadi siswa.
- [ ] Jangan expose credential/token.
- [ ] Verifikasi permission course/activity.

## Issue #29 — Documentation
- [ ] Dokumentasi komponen.
- [ ] Education-level configuration.
- [ ] API/data dependencies.
- [ ] Moodle mapping.
- [ ] Fitur khusus SMK.

## Issue #30 — Final Acceptance
- [ ] Dashboard siswa tersedia.
- [ ] SD/SMP/SMA/SMK didukung.
- [ ] Mata pelajaran.
- [ ] Guru.
- [ ] Tugas.
- [ ] Deadline.
- [ ] Kalender.
- [ ] Jadwal.
- [ ] Nilai.
- [ ] Progress.
- [ ] Pengumuman.
- [ ] Notifikasi.
- [ ] Aktivitas terbaru.
- [ ] Continue learning.
- [ ] Empty/loading/error states.
- [ ] Responsive.
- [ ] Accessible.
- [ ] Moodle permission aman.
- [ ] Tidak ada mock data production.
- [ ] Dashboard guru/admin tidak rusak.
- [ ] Lint berhasil.
- [ ] Typecheck berhasil.
- [ ] Build berhasil.
- [ ] Test berhasil.

## Urutan Implementasi
1. Audit Repository
2. Role & Routing
3. Layout
4. Student Header
5. Summary
6. Mata Pelajaran
7. Tugas & Deadline
8. Jadwal
9. Kalender
10. Nilai
11. Progress
12. Continue Learning
13. Pengumuman
14. Notifikasi
15. Recent Activity
16. Fitur SMK
17. Responsive
18. Accessibility
19. Performance
20. Testing
21. Security Review
22. Final QA

## Product Goal

Saat siswa membuka dashboard, dalam beberapa detik mereka harus dapat menjawab:

> **Apa yang harus saya kerjakan hari ini?**

Kemudian:
- Kapan deadline-nya?
- Ada pelajaran apa hari ini?
- Bagaimana perkembangan belajar saya?
- Apakah ada pengumuman dari guru/sekolah?

Dashboard harus terasa seperti **pusat aktivitas sekolah siswa**, bukan dashboard administrasi Moodle.

## Important Implementation Rule

Sebelum mengubah kode:
1. Audit branch `development`.
2. Gunakan component existing.
3. Gunakan design system existing.
4. Gunakan API/data layer existing.
5. Jangan membuat mock API permanen.
6. Jangan membuat LMS baru di frontend.
7. Jangan mengubah dashboard guru/admin.
8. Authorization tetap server-side.
9. UI wajib menggunakan konteks SD/SMP/SMA/SMK.
10. Jalankan lint, typecheck, build, dan test setelah implementasi.
