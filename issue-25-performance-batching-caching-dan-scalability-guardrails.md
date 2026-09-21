# ISSUE 25 — Performance, batching, caching, dan scalability guardrails

## Dependensi

Issue 24

## Tujuan

Mengoptimalkan akses Moodle dan UI management tanpa mengorbankan source-of-truth attempt aktif.

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

- Audit N+1 Moodle calls.
- Gunakan batch operations bila API mendukung.
- Jalankan independent reads secara parallel dengan batas wajar.
- Semua Moodle request memiliki bounded timeout.
- Cache hanya metadata yang aman/stabil.
- Jangan cache active attempt sebagai source of truth authoritative.
- Monitor endpoint tetap aggregated.
- Pagination pada tabel besar.
- Tambahkan pengukuran/telemetry sederhana untuk latency request penting jika core logger mendukung.

## Strategi TDD

### RED
- Test/benchmark sederhana yang membuktikan call count pada skenario list/monitor.
- Test cache tidak dipakai untuk active attempt source of truth.
- Test timeout/batch behavior.

### GREEN
Optimalkan hotspot nyata.

### REFACTOR
Hapus premature caching dan pastikan invalidation policy terdokumentasi.

## Kriteria penerimaan

- Tidak ada N+1 yang diketahui pada flow utama.
- Call count monitor tidak tumbuh linear per participant ke Moodle.
- Cache policy eksplisit.
- Pagination tersedia pada list besar.
- Verify/build/test tetap lulus.

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
