# ISSUE 06 — Tenant resolver, enkripsi kredensial, dan Moodle handshake

## Dependensi

Issue 05

## Tujuan

Menyelesaikan boundary tenant sebelum autentikasi: resolusi tenant dari hostname, isolasi credential per tenant, AES-256-GCM, dan test koneksi Moodle.

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

- Implementasikan entity/DTO/rules/validator `tenant`.
- Resolve hostname → tenant slug → repository → `TenantContext`.
- Tolak tenant `SUSPENDED`/status yang tidak mengizinkan request sesuai rule.
- Implementasikan `EncryptionProvider` dengan `aes-256-gcm`, master key 256-bit dari env, HKDF-SHA256 berbasis `tenantId`, IV 12 byte acak, auth tag 16 byte, format penyimpanan `base64(iv + auth_tag + ciphertext)`.
- Implementasikan `EncryptedTenantCredentialProvider`.
- Implementasikan `TestMoodleConnectionUseCase`.
- Handshake memvalidasi admin token, health plugin, proctor token, release/site ID/latency sesuai planning.
- Terapkan validasi SSRF terhadap `moodleUrl`; jangan izinkan target privat/loopback bila kebijakan deployment planning mensyaratkannya.
- Tenant A tidak boleh pernah memakai credential Tenant B.

## Strategi TDD

### RED
- Lookup tenant dari hostname valid/tidak valid.
- Tenant nonaktif ditolak.
- Encrypt/decrypt round-trip per tenant.
- Ciphertext tenant A gagal/ditolak bila didekripsi dengan tenant B.
- Token invalid dan plugin health invalid menghasilkan diagnostic terkontrol.
- Test tenant isolation.

### GREEN
Implementasikan use case, provider, resolver, dan factory integration.

### REFACTOR
Pastikan crypto detail tetap berada di provider, bukan domain.

## Kriteria penerimaan

- Semua Moodle access berikutnya menerima tenant context yang sudah resolved.
- Credential tersimpan terenkripsi dan tidak pernah dikirim ke browser.
- Test connection menghasilkan status diagnostic tanpa membocorkan token.
- Tenant isolation test lulus.

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
