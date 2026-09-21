# ISSUE 16 — Student Exam UI B: autosave, offline/retry, summary, submit, dan review

## Dependensi

Issue 15

## Tujuan

Mengintegrasikan lifecycle attempt ke UI siswa secara tahan gangguan jaringan dan aman saat submit.

## Kontrak arsitektur wajib

Ketentuan berikut berlaku untuk seluruh pekerjaan pada issue ini dan **tidak boleh dinegosiasikan**:

- Browser hanya berkomunikasi dengan API internal Next.js di `/api/v1/*`; browser **tidak boleh** memanggil Moodle secara langsung.
- Moodle tetap menjadi **source of truth** untuk user akademik, course, enrolment, quiz, question, attempt, dan grade.
- Database Next.js/Prisma hanya menyimpan metadata operasional SaaS multi-tenant, kredensial terenkripsi, branding, dan audit internal yang memang dibutuhkan.
- Next.js **dilarang** mengakses database SQL Moodle secara langsung.
- `domain` tidak boleh mengimpor React, Next.js, Prisma, Moodle client, `fetch`, atau implementation infrastructure.
- `application` hanya bergantung pada domain/core abstraction; `infrastructure` mengimplementasikan port domain.
- `presentation/hooks` hanya memanggil `/api/v1/*`; `sections/atoms` dan `sections/molecules` tidak memanggil API.
- `MoodleRestClient` dan semua token Moodle bersifat **server-only**. Token, password, stack trace Moodle, dan secret tidak boleh masuk ke response browser maupun log.
- TDD wajib mengikuti **RED → GREEN → REFACTOR**. Perbaikan bug harus dimulai dari regression test yang gagal.
- Jangan membuat abstraction kosong atau generic abstraction sebelum ada kebutuhan nyata.
- Jangan mengubah Moodle core.
- Jangan menggabungkan module `quizzes` dan `quiz-attempts`.

## Aturan pengerjaan AI

1. Kerjakan **hanya scope issue ini** dan dependency yang secara eksplisit disebutkan.
2. Jangan mengimplementasikan issue berikutnya lebih awal hanya karena terlihat mudah.
3. Sebelum mengubah kode, audit struktur yang sudah ada dan gunakan komponen/core abstraction yang telah tersedia.
4. Pertahankan backward compatibility pada contract internal yang sudah dipakai issue sebelumnya.
5. Jika ditemukan bug di luar scope, dokumentasikan sebagai temuan; jangan memperluas scope secara diam-diam.
6. Tidak boleh menggunakan `any` tanpa alasan terdokumentasi.
7. API route harus tipis: validasi/resolve context → panggil use case → map response.
8. Setelah GREEN, lakukan REFACTOR tanpa mengubah perilaku dan pastikan seluruh test tetap hijau.


## Cakupan pekerjaan

- Hubungkan autosave ke endpoint issue 12.
- Tampilkan state `saving/saved/retrying/offline` yang nyata.
- Hindari kehilangan jawaban saat navigasi cepat.
- Implementasikan summary sebelum submit.
- Implementasikan final confirmation.
- Saat `submitting`, cegah double-action pada UI.
- Setelah submit, tampilkan state final dan arahkan ke review/result yang diizinkan.
- Jangan menyimpan jawaban sebagai source of truth kedua di local/DB tanpa arsitektur offline yang disetujui.

## Strategi TDD

### RED
- Simulasi autosave sukses/gagal/transient.
- Navigasi saat save pending tidak kehilangan state tampilan.
- Double-click submit tidak menghasilkan duplicate UI action.
- Offline → retry → saved berjalan.
- Review yang tidak diizinkan tidak dirender.

### GREEN
Integrasikan hooks dan organisms.

### REFACTOR
Pisahkan side-effect autosave/submit dari presentational components.

## Kriteria penerimaan

- Siswa dapat start/resume → answer → autosave → navigate → summary → submit → result/review.
- State jaringan terlihat dan tidak menyesatkan.
- Tidak ada direct Moodle call di browser.
- Critical student interaction tests lulus.

## Di luar cakupan

- Feature pada issue berikutnya yang belum menjadi dependency.
- Perubahan Moodle core.
- Direct database access ke Moodle.
- Refactor lintas module yang tidak diperlukan untuk memenuhi kriteria issue ini.
- Perubahan contract publik/internal yang sudah dipakai issue sebelumnya tanpa regression test dan alasan teknis yang jelas.

## Verifikasi akhir

Jalankan dan pastikan lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika repository menyediakan `npm run verify`, jalankan juga sebagai pemeriksaan gabungan.


## Definition of Done issue

- [ ] Scope issue selesai tanpa pekerjaan tersembunyi dari issue berikutnya.
- [ ] RED test dibuat terlebih dahulu untuk perilaku baru/bug yang relevan.
- [ ] GREEN dicapai dengan implementasi minimum yang benar.
- [ ] REFACTOR dilakukan tanpa mematahkan boundary arsitektur.
- [ ] Domain/application tests lulus.
- [ ] Adapter/infrastructure tests lulus bila relevan.
- [ ] Loading/Empty/Error state tersedia bila issue memiliki UI.
- [ ] Pagination tersedia bila issue memiliki list yang dapat membesar.
- [ ] Tenant isolation dipertahankan.
- [ ] Tidak ada secret Moodle yang mencapai browser/log.
- [ ] Tidak ada dead code dan tidak ada `any` tanpa penjelasan.
- [ ] TypeScript, Biome, test, dan build lulus.
