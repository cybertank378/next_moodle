# Issue — Shared `APP_SECRET` Webhook Bridge for `local_examapi`

## Nama Issue

`local-examapi-app-secret-webhook-bridge`

## Bounded Engineering Objective

Menambahkan kontrak shared secret antara `local_examapi` dan Next.js untuk **webhook keluar dari Moodle ke Next.js**. Secret digunakan untuk menandatangani payload dengan HMAC-SHA256 agar Next.js dapat memverifikasi bahwa event berasal dari Moodle tenant yang sah.

Kontrak ini tidak menggantikan autentikasi Moodle REST. Next.js tetap memanggil Moodle dengan `wstoken` dan service boundary `nextjs_student`, `nextjs_admin`, atau `nextjs_proctor`.

## Dependency

- `local_examapi` telah terpasang dan aktif.
- Service account dan REST service `nextjs_*` telah diprovisioning.
- Next.js menyediakan endpoint HTTPS penerima webhook dan menyimpan `APP_SECRET` server-side.

## Scope

1. Tambahkan konfigurasi plugin berikut pada `local_examapi/settings.php`:

   - `local_examapi/webhook_url` — URL HTTPS endpoint Next.js; kosong berarti webhook dinonaktifkan.
   - `local_examapi/app_secret` — shared secret 64 karakter heksadesimal; gunakan `PARAM_ALPHANUMEXT` atau validator khusus yang menerima hex saja.

2. Tambahkan string bahasa Inggris dan Indonesia untuk label, deskripsi, serta error konfigurasi pada `lang/en/local_examapi.php` dan `lang/id/local_examapi.php`.

3. Buat `classes/service/webhook_service.php` yang:

   - membaca konfigurasi tanpa pernah mengembalikan secret ke external API, log, atau exception;
   - menolak URL non-HTTPS pada environment non-development;
   - membuat payload JSON kanonik;
   - menghitung signature `hash_hmac('sha256', "{timestamp}.{deliveryid}.{rawbody}", appsecret)`;
   - mengirim header berikut:

     ```text
     Content-Type: application/json
     X-Examapi-Event: {event-name}
     X-Examapi-Timestamp: {unix-seconds}
     X-Examapi-Delivery-Id: {uuid}
     X-Examapi-Signature: sha256={hex-hmac}
     ```

   - memakai timeout ketat, tidak mengikuti redirect lintas origin, dan menyensor URL/secret/header sensitif dari log;
   - memperlakukan respons HTTP non-2xx sebagai kegagalan delivery yang aman.

4. Kirim webhook hanya setelah operasi Moodle berhasil dan event plugin telah dipersistenkan. Event minimum:

   ```text
   attempt.locked
   attempt.unlocked
   attempt.force_finished
   attempt.time_extended
   exam.result_available
   ```

5. Gunakan adhoc task atau persistent delivery queue untuk pengiriman/retry agar external function tidak menunggu request HTTP Next.js. Simpan delivery ID, event, waktu, jumlah retry, dan status; jangan simpan `app_secret` atau raw Moodle token.

6. Tambahkan retry terbatas dengan exponential backoff. Delivery harus idempotent: `X-Examapi-Delivery-Id` yang sama dipakai pada setiap retry.

7. Perbarui `README.md` dan `api-manifest.json` hanya untuk mendokumentasikan webhook sebagai integrasi opsional. Jangan menyatakannya production-ready sebelum test delivery nyata tersedia.

## Kontrak Next.js

Next.js menerima webhook di endpoint internal, misalnya:

```text
POST /api/webhooks/moodle
```

Next.js wajib:

1. membaca raw request body sebelum parsing JSON;
2. memverifikasi HMAC dengan constant-time comparison menggunakan `APP_SECRET` tenant yang sama;
3. menolak timestamp lebih dari lima menit atau delivery ID yang pernah diproses;
4. membalas `2xx` hanya setelah payload tervalidasi dan diterima;
5. tidak pernah menganggap webhook sebagai pengganti query/otorisasi Moodle untuk aksi akademik.

## Security Rules

- `APP_SECRET` tidak boleh dikembalikan oleh `get_health`, `get_capabilities`, external function lain, UI settings, atau log.
- Jangan menggunakan `APP_SECRET` sebagai pengganti `wstoken` pada panggilan Next.js → Moodle.
- Jangan mengirim secret melalui query string.
- Validasi HTTPS dan blok private/loopback target kecuali test yang secara eksplisit diizinkan.
- Gunakan `hash_equals()` saat membandingkan signature jika plugin juga memiliki endpoint inbound di masa depan.
- Rotasi secret harus didukung secara operasional; delivery lama tidak boleh membocorkan secret saat gagal.

## Out of Scope

- Mengubah autentikasi user/student Moodle.
- Mengganti service token `nextjs_student`, `nextjs_admin`, atau `nextjs_proctor`.
- Browser mengirim atau membaca `APP_SECRET`.
- Membuat direct database access dari Next.js ke Moodle.
- Menjadikan webhook sebagai source of truth attempt, grade, atau audit.

## TDD — RED → GREEN → REFACTOR

### RED

Tambahkan test yang gagal untuk:

- secret kosong, placeholder, atau bukan 64 hex ditolak;
- URL webhook non-HTTPS ditolak di production;
- signature cocok dengan raw body, timestamp, dan delivery ID;
- perubahan satu byte pada body/timestamp/delivery ID menghasilkan signature berbeda;
- header secret tidak muncul dalam log/error payload;
- external function sukses tetap sukses ketika webhook dinonaktifkan;
- event tidak dikirim sebelum operasi utama berhasil;
- retry memakai delivery ID yang sama dan berhenti pada batas yang ditentukan.

### GREEN

Implementasikan validator konfigurasi, service signing, queue/task delivery, dan integrasi event minimum.

### REFACTOR

- pindahkan konstanta header/event ke satu service internal;
- hapus duplikasi sanitasi log;
- pastikan tidak ada external function yang menerima atau mengembalikan `APP_SECRET`.

## Acceptance Criteria

- [ ] Admin Moodle dapat mengatur `webhook_url` dan `app_secret` tanpa secret dirender kembali pada UI.
- [ ] Secret invalid tidak dapat disimpan atau digunakan untuk delivery.
- [ ] Webhook valid memiliki seluruh header kontrak dan HMAC yang deterministik terhadap raw payload.
- [ ] Secret, token Moodle, dan `Authorization` tidak muncul dalam log atau respons error.
- [ ] Delivery gagal tidak membatalkan operasi attempt/result Moodle yang sudah berhasil.
- [ ] Retry dibatasi, terjadwal, dan idempotent dengan delivery ID yang sama.
- [ ] Semua test RED/GREEN/REFACTOR lulus.
- [ ] Test regresi membuktikan REST service token tetap menjadi satu-satunya autentikasi untuk Next.js → Moodle.

## Definition of Done

- [ ] Implementasi dan test berada di `local_examapi`.
- [ ] `settings.php`, language strings, dan dokumentasi diperbarui.
- [ ] Tidak ada secret hard-coded atau serialized ke browser/REST response.
- [ ] Tidak ada perubahan Moodle core.
- [ ] Kontrak header dan algoritme signature terdokumentasi untuk implementasi Next.js.
