# feat(notification): Pengelolaan Notifikasi Admin dan Tenant dengan Hexagonal Architecture dan Reusable Tiptap Editor

## Tujuan

Admin Platform dan Tenant dapat membuat, mengubah draft, memilih penerima, menjadwalkan, mengirim, dan memantau notifikasi dari Next.js tanpa membuka Firebase Console untuk kegiatan operasional tersebut. Notifikasi tersedia di inbox aplikasi; push dikirim melalui Firebase Cloud Messaging (FCM).

Setup awal proyek Firebase, IAM/credential, Cloud Messaging, dan konfigurasi browser tetap merupakan pekerjaan deployment. Modul ini tidak menggantikan seluruh Firebase Console dan tidak mengimpor otomatis campaign yang dibuat di Console.

Repository acuan: https://github.com/cybertank378/next_moodle/tree/development

Baseline yang ditinjau: `d08713f2d5b8f75196f32a454f2a39a987c8a0ef`. Periksa perubahan branch terbaru sebelum implementasi. Issue ini adalah rencana; belum ada kode fitur yang diterapkan.

## Temuan kode saat ini

- Sudah ada `src/modules/notification` dengan entity, DTO, repository, adapter FCM, use case inbox/count/read, controller, dan hook `useNotificationApi`.
- `CreateNotificationUseCase` saat ini merupakan producer server-side, bukan endpoint komposer campaign browser. Pertahankan perilaku producer tersebut.
- Model `Notification` menyimpan notifikasi per penerima dengan tenant, role, judul, body plain text, link internal, dan status dibaca.
- Adapter FCM sekarang menangkap error tanpa meneruskannya; producer memanggil dispatch secara fire-and-forget. Pola ini belum memberi laporan pengiriman yang dapat diandalkan.
- Endpoint subscribe membersihkan karakter nama topic, sedangkan adapter dispatch membentuk nama topic tanpa normalisasi yang sama. Perlu pemeriksaan konsistensi dan pengujian regresi.
- Dependensi `@tiptap/react`, `@tiptap/pm`, dan `@tiptap/starter-kit` sudah ada. Audit penggunaan yang ada sebelum menambah versi atau extension.
- Folder `functions` yang ditinjau belum berisi worker pengiriman aktif. Jangan menganggap scheduler/queue sudah tersedia.

## Ruang lingkup

1. Pengelolaan campaign/pengumuman dengan draft, preview, pengiriman segera, jadwal, pembatalan, arsip, dan laporan.
2. Penargetan penerima berdasarkan tenant, role, atau pengguna terpilih melalui lookup server.
3. Integrasi inbox yang sudah ada dan push FCM dengan pencatatan hasil per target.
4. Worker persisten, retry terbatas, idempotency, dan pencatatan audit.
5. Halaman management untuk Admin dan Tenant serta integrasi sidebar.
6. Komponen rich text editor Tiptap yang dapat digunakan lintas fitur.

Tidak termasuk email/SMS, billing Firebase, analytics perangkat yang tidak tersedia, lampiran/upload gambar, kolaborasi editor, dan penyalinan fitur Firebase Console secara keseluruhan.

## Kebijakan akses dan kepemilikan

| Kemampuan | ADMIN | TENANT |
| --- | --- | --- |
| Membuat campaign | Platform atau tenant yang dipilih | Tenant aktor saja |
| Memilih penerima | Role/pengguna pada tenant terotorisasi; platform admins; seluruh tenant dengan cakupan eksplisit | Role/pengguna yang tervalidasi dalam tenant sendiri |
| Mengelola campaign | Campaign milik platform; inspeksi campaign tenant untuk administrasi | Campaign milik tenant sendiri |
| Mengubah campaign tenant lain | Operasi override eksplisit dengan permission dan audit | Dilarang |
| Melihat laporan | Sesuai cakupan campaign yang terotorisasi | Hanya campaign tenant sendiri |
| Membaca inbox pribadi | Hanya notifikasi aktor sendiri melalui API inbox | Hanya notifikasi aktor sendiri melalui API inbox |

- [ ] Role dan permission dicek pada setiap endpoint dan use case, termasuk lookup, preview, detail, retry, dan report.
- [ ] Actor berasal dari resolver sesi; `actorId`, role aktor, dan tenant efektif tidak dipercaya dari body browser.
- [ ] Untuk TENANT, tenantId efektif selalu dari actor. Payload tenantId berbeda ditolak.
- [ ] ADMIN yang memilih seluruh tenant menerima preview jumlah dan mengonfirmasi cakupan sebelum pengiriman melalui UI.
- [ ] Teacher/Student/Proctor tetap menjadi penerima; tidak memperoleh akses management hanya karena memiliki inbox.
- [ ] Server memverifikasi keanggotaan penerima menggunakan sumber identitas aktual proyek, termasuk Moodle jika diperlukan. Jangan mengasumsikan seluruh pengguna tersimpan di Prisma.
- [ ] ADMIN tidak boleh memakai management untuk menandai inbox pengguna lain sebagai dibaca.
- [ ] Permission management diselaraskan dengan RBAC proyek: read/create/update/send/cancel/archive/report; nama konstanta final mengikuti konvensi yang ada.

## Konsep hexagonal

Domain dan application tidak bergantung pada Next.js, Prisma, Firebase, React, atau Tiptap. Application memanggil port domain; controller adalah inbound adapter, Prisma/FCM/lookup/clock/worker adalah outbound adapters. Factory merupakan composition root untuk dependency injection.

Gunakan folder **`notification` yang sudah ada**, bukan membuat duplikat `notifications`. Pertahankan nama file `Dto` pada file yang ada; file baru mengikuti standar repository secara konsisten, dengan fungsi yang setara contoh `DTO` pengguna.

## Struktur modul target

```text
src/modules/notification/
├── application/
│   ├── services/
│   │   ├── NotificationService.ts
│   │   ├── NotificationAuthorizationService.ts
│   │   └── NotificationDispatchService.ts
│   └── usecases/
│       ├── GetNotificationsUseCase.ts                  # inbox existing
│       ├── CreateNotificationUseCase.ts                # producer existing
│       ├── GetUnreadCountUseCase.ts                    # existing
│       ├── MarkNotificationReadUseCase.ts              # existing
│       ├── MarkAllReadUseCase.ts                       # existing
│       ├── GetNotificationCampaignListUseCase.ts
│       ├── GetNotificationCampaignByIdUseCase.ts
│       ├── CreateNotificationCampaignUseCase.ts
│       ├── UpdateNotificationCampaignUseCase.ts
│       ├── DeleteNotificationDraftUseCase.ts
│       ├── PreviewNotificationAudienceUseCase.ts
│       ├── GetNotificationRecipientOptionsUseCase.ts
│       ├── SendNotificationCampaignUseCase.ts
│       ├── ScheduleNotificationCampaignUseCase.ts
│       ├── CancelNotificationCampaignUseCase.ts
│       ├── ArchiveNotificationCampaignUseCase.ts
│       ├── RetryNotificationDeliveryUseCase.ts
│       └── GetNotificationDeliveryReportUseCase.ts
├── domain/
│   ├── builder/
│   │   └── NotificationQueryBuilder.ts
│   ├── dto/
│   │   ├── NotificationRequestDto.ts                   # inbox existing
│   │   ├── NotificationResponseDto.ts                  # inbox existing
│   │   ├── NotificationCampaignRequestDto.ts
│   │   └── NotificationCampaignResponseDto.ts
│   ├── entity/
│   │   ├── NotificationEntity.ts                       # existing
│   │   ├── NotificationCampaignEntity.ts
│   │   └── NotificationDeliveryEntity.ts
│   ├── interfaces/
│   │   ├── NotificationInterfaces.ts                   # actor/clock/unit-of-work ports
│   │   ├── NotificationRepositoryInterface.ts          # existing
│   │   ├── NotificationCampaignRepositoryInterface.ts
│   │   ├── NotificationDeliveryRepositoryInterface.ts
│   │   ├── NotificationRecipientProviderInterface.ts
│   │   ├── NotificationContentRendererInterface.ts
│   │   ├── NotificationAuditInterface.ts
│   │   └── PushNotificationAdapterInterface.ts         # adapt result contract safely
│   ├── mapper/
│   │   ├── NotificationMapper.ts                       # existing
│   │   └── NotificationCampaignMapper.ts
│   ├── types/
│   │   └── NotificationTypes.ts
│   └── value-object/
│       ├── NotificationScope.ts                        # existing
│       ├── NotificationContent.ts
│       ├── NotificationAudience.ts
│       └── NotificationSchedule.ts
├── infrastructure/
│   ├── http/
│   │   ├── NotificationController.ts                   # inbox existing
│   │   └── NotificationManagementController.ts
│   ├── providers/
│   │   ├── FirebaseCloudMessagingAdapter.ts            # existing adapter
│   │   ├── NotificationProvider.ts                     # actor/recipient lookup adapter
│   │   ├── NotificationContentRenderer.ts
│   │   ├── NotificationAuditAdapter.ts
│   │   └── NotificationDispatchWorker.ts
│   ├── repo/
│   │   ├── PrismaNotificationRepository.ts             # existing
│   │   ├── PrismaNotificationCampaignRepository.ts
│   │   └── PrismaNotificationDeliveryRepository.ts
│   ├── templates/
│   │   └── AnnouncementTemplate.ts
│   └── validators/
│       ├── notificationValidator.ts                   # existing
│       └── notificationManagementValidator.ts
├── presentation/
│   ├── helpers/
│   │   ├── notificationManagementFormatters.ts
│   │   └── notificationManagementQuery.ts
│   └── hooks/
│       ├── useNotificationApi.ts                       # inbox existing
│       └── useNotificationManagementApi.ts
└── __tests__/
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── helpers/
```

Service mengorkestrasi use case, bukan menduplikasi semua aturan. Query builder menghasilkan query domain netral; penerjemahan Prisma berada pada repository. Jangan memasukkan tipe Prisma/Tiptap JSONContent ke domain. Gunakan tipe dokumen rich text netral milik aplikasi.

## Data dan kontrak

### Model baru usulan

| Model | Isi utama |
| --- | --- |
| NotificationCampaign | id, ownerScope PLATFORM/TENANT, ownerTenantId nullable, createdById/role, title, contentJson, contentSchemaVersion, sanitizedHtml, plainText, pushSummary, audienceSpec, channels, dispatchStatus, scheduledAt, timezone, archivedAt, version, createdAt/updatedAt |
| NotificationCampaignRecipient | campaignId, tenantId nullable, recipientId, recipientRole, snapshot waktu resolusi; unique identitas penerima per campaign |
| NotificationDelivery | campaignId, recipientId/role/tenant, channel, device target reference bila PUSH, status, attempts, nextAttemptAt, providerMessageId, errorCode, acceptedAt, timestamps |
| NotificationOutbox | job id, campaignId, jenis, availableAt, leaseOwner/leaseExpiresAt, attempt, status; ditulis transaksional |
| NotificationDevice | userId, role, tenantId, target SDK aktual, active, lastSeenAt; unique perangkat/target dengan ownership server |

- [ ] Tambahkan relasi campaign pada Notification inbox sebagai nullable untuk kompatibilitas data historis.
- [ ] Pastikan dedupe penerima platform dengan tenantId null efektif di PostgreSQL; nullable unique biasa tidak cukup. Gunakan scopeKey non-null atau strategi indeks yang tepat.
- [ ] Rich text canonical adalah JSON tervalidasi; HTML dan plain text diturunkan server-side, tidak dipercaya dari client.
- [ ] Push hanya judul dan ringkasan plain text, ID, dan deep link internal. Jangan mengirim dokumen rich text lengkap ke FCM.
- [ ] Pertahankan batas title 200 karakter dan body inbox existing 1000 sampai kontrak migrasi disepakati. Konten rich text dibatasi terpisah, misalnya 50 KiB JSON dan 10.000 karakter teks, tervalidasi server-side.
- [ ] `pushSummary` boleh diisi penulis atau diturunkan server; validasi batas byte payload sesuai SDK/FCM yang terpasang, termasuk metadata.
- [ ] Audience DTO hanya membawa tenant/role/user IDs yang relevan; resolved recipient identity berasal dari server.
- [ ] Filter list: search, status, channel, tenantId khusus ADMIN, createdAt range, page, limit, sortBy/sortOrder allowlist. Sorting tidak menerima nama kolom bebas.
- [ ] Response menyertakan scope, status, jumlah audience/inbox/push accepted/failed/pending/skipped, jadwal, dan audit summary tanpa credential/device token.
- [ ] Gunakan optimistic locking `version`; update stale menghasilkan conflict, bukan menimpa edit lain.
- [ ] Buat migration additive/backfill yang diperlukan dan indeks list, due-jobs, serta dedupe. Jangan reset database.

### Siklus status

`DRAFT → QUEUED → PROCESSING → COMPLETED | PARTIAL_FAILED | FAILED`

`DRAFT → SCHEDULED → QUEUED`, dengan `SCHEDULED → DRAFT` untuk membatalkan jadwal sebelum pengiriman.

- [ ] Edit/delete hanya untuk DRAFT. Campaign terjadwal harus dibatalkan jadwalnya sebelum edit.
- [ ] Cancel menjadikan SCHEDULED/QUEUED sebagai CANCELLED apabila belum mulai dikirim; PROCESSING menghentikan target yang belum diambil worker dan mencatat hasil parsial yang telah terjadi.
- [ ] COMPLETED/PARTIAL_FAILED/FAILED adalah hasil operasi, bukan bukti perangkat menerima atau membaca.
- [ ] `archivedAt` adalah atribut tampilan terpisah, bukan pengganti dispatchStatus.
- [ ] Pesan yang sudah masuk inbox/push tidak ditarik kembali oleh cancel, delete, atau archive.
- [ ] Snapshot audience dibuat ketika queue mulai dieksekusi; preview sebelumnya bersifat perkiraan. Periksa ulang scope dan keaktifan penerima saat mengirim.
- [ ] Jadwal disimpan UTC dan ditampilkan dengan timezone yang dipilih. Jangan bergantung pada timer browser atau satu invocation serverless.

## Pengiriman FCM dan worker

- [ ] Inisialisasi Firebase Admin hanya server-side melalui provider bersama, singleton; credential tidak menggunakan `NEXT_PUBLIC_*`.
- [ ] Management bekerja untuk draft/inbox ketika push belum dikonfigurasi; channel PUSH memberi error konfigurasi yang jelas, bukan sukses palsu.
- [ ] Prioritaskan target perangkat yang dipetakan ke actor secara sah untuk pesan personal/tenant. Nama topic yang bisa ditebak bukan mekanisme authorization untuk data privat.
- [ ] Audit/migrasikan alur subscribe topic existing. Jika topic dipertahankan untuk pengumuman non-sensitif, pakai helper normalisasi yang sama pada subscribe/dispatch dan kelola unsubscribe saat logout/perubahan tenant.
- [ ] Registrasi perangkat memvalidasi sesi, target, ukuran payload, ownership dan rotasi; jangan izinkan satu perangkat membawa subscription pengguna lama ke sesi pengguna baru.
- [ ] Adapter mengembalikan typed result/error dan tidak menelan kegagalan; batas batch mengikuti SDK yang terpasang dan dokumentasi resminya.
- [ ] Simpan campaign dan outbox secara atomik; endpoint send mengembalikan 202/job ID setelah enqueue, tidak menunggu broadcast selesai.
- [ ] Worker melakukan claim atomic/lease, batching terbatas, progress checkpoint, retry transient dengan exponential backoff+jitter, dan batas percobaan.
- [ ] Non-retryable error tidak diulang; invalid device target dinonaktifkan secara aman. Jangan nonaktifkan target karena kesalahan credential atau payload.
- [ ] Gunakan idempotency key pada send/retry dan unique delivery/inbox identity. Retry hanya target gagal yang masih eligible; inbox yang berhasil tidak dibuat ulang.
- [ ] FCM tidak menjamin exactly-once. Timeout setelah provider menerima dapat memicu duplikasi; client/service worker dedupe berdasarkan notification/delivery ID.
- [ ] Pisahkan status inbox created, FCM accepted, failed, skipped-no-device, dan pending. `isRead` berasal dari aksi pengguna yang terautentikasi, bukan dari acceptance FCM.
- [ ] Test push hanya ke perangkat aktor pengelola; bukan broadcast terselubung.
- [ ] Tentukan runner persisten saat implementasi: CLI worker pada deployment yang mendukung proses, atau job terautentikasi dari scheduler eksternal. Jangan menambah endpoint worker publik.
- [ ] Tambahkan runbook menjalankan worker, env server/client, VAPID, HTTPS/service worker, pemulihan lease, retry, dan pemantauan backlog. Setup satu kali dapat memerlukan Firebase Console/IAM.

## API yang diusulkan

Pertahankan API inbox `/api/notifications`, `/count`, dan `/[id]/read`. Gunakan namespace management terpisah; query actor dikonstruksi server-side.

| Method | Endpoint | Fungsi |
| --- | --- | --- |
| GET/POST | `/api/notification-management/campaigns` | List scoped / create draft |
| GET/PATCH/DELETE | `/api/notification-management/campaigns/[id]` | Detail / update version / delete draft |
| POST | `/api/notification-management/campaigns/[id]/preview` | Preview audience dan pesan |
| POST | `/api/notification-management/campaigns/[id]/send` | Enqueue pengiriman immediate |
| POST | `/api/notification-management/campaigns/[id]/schedule` | Jadwalkan |
| POST | `/api/notification-management/campaigns/[id]/cancel` | Cancel jadwal/pengiriman sesuai status |
| POST | `/api/notification-management/campaigns/[id]/archive` | Arsip |
| POST | `/api/notification-management/campaigns/[id]/retry` | Enqueue retry eligible |
| GET | `/api/notification-management/campaigns/[id]/deliveries` | Laporan paginated |
| GET | `/api/notification-management/recipients` | Lookup scoped dan paginated |
| POST | `/api/notification-management/test-push` | Test hanya perangkat aktor |
| POST/DELETE | `/api/notifications/devices` | Register/unregister perangkat aktor |

- [ ] `_factory.ts` namespace management merakit controller/use case/ports/adapters.
- [ ] Gunakan envelope/error mapper, authenticated API helper, serta resolver proyek.
- [ ] Validasi request body dan query dengan pola validator proyek; jangan mengasumsikan library validator baru harus dipasang.
- [ ] Mutasi cookie-auth mengikuti proteksi CSRF/origin proyek; apply rate limit pada send/test dan registrasi perangkat.
- [ ] ID resource di luar scope menghasilkan respons konsisten tanpa membocorkan detail tenant lain.

## Reusable rich text editor Tiptap

Lokasi target:

```text
src/shared-ui/component/RichTextEditor/
├── RichTextEditor.tsx
├── RichTextEditorToolbar.tsx
├── RichTextEditorField.tsx
├── RichTextViewer.tsx
├── RichTextEditorTypes.ts
└── richTextEditorExtensions.ts
```

- [ ] `RichTextEditor` menerima value JSON netral, onChange, disabled, readOnly, placeholder, aria-label/label ID, className, fitur toolbar yang diizinkan, dan maxLength sesuai kebutuhan.
- [ ] `RichTextEditorField` menghubungkan label, helper/error, required, dan form components bersama. Tidak melakukan fetch dan tidak bergantung pada notification.
- [ ] `onChange` memberikan JSON dan plain text; representasi JSON adalah sumber utama. Jangan memakai HTML client sebagai bukti sudah tersanitasi.
- [ ] Tiptap berada dalam komponen `"use client"` dengan `immediatelyRender: false` untuk SSR Next.js.
- [ ] Value eksternal untuk create/edit/reset tersinkron tanpa update loop, emit ganda, atau mereset cursor setiap ketikan. Update toolbar berdasarkan selection aktif.
- [ ] Fitur awal: paragraph, heading H2/H3, bold, italic, strike, bullet/ordered list, blockquote, link, undo/redo, clear formatting. Audit StarterKit agar extension tidak terdaftar ganda.
- [ ] Tidak mengaktifkan raw HTML, iframe, embed, script, image upload, atau paste gambar pada tahap ini.
- [ ] Validasi node/mark/atribut, depth dan ukuran JSON di server. Sanitasi HTML hasil render dengan allowlist dan kebijakan URL; tolak javascript/data URLs dan atribut event handler.
- [ ] Link konten mengikuti protokol yang diizinkan; deep link push hanya path internal yang juga dicek authorization saat dibuka.
- [ ] Viewer menampilkan konten aman dengan typography konsisten. List dalam konten editor/viewer boleh berupa elemen semantik yang dihasilkan Tiptap; tombol toolbar tetap memakai shared Button.
- [ ] Toolbar keyboard accessible, aria-pressed untuk format, accessible label ikon, focus-visible; editor tidak mengambil fokus otomatis pada mobile.
- [ ] Read-only/disabled bekerja pada editor dan toolbar; empty content seperti paragraf kosong dianggap kosong oleh validasi required.
- [ ] Jangan membutuhkan Tiptap Cloud atau fitur berbayar untuk fungsi awal.
- [ ] Tambahkan tests di struktur shared-ui proyek untuk reset/value sync, formatting, disabled/read-only, empty validation, dan hydration smoke check.
- [ ] Uji renderer/sanitizer server secara terpisah untuk XSS serta dokumen JSON malformed. Editor client bukan batas keamanan.

## UI management dan atomic design

Gunakan halaman Admin dan Tenant mengikuti route group aktual setelah audit App Router: rute URL yang diusulkan `/admin/notifications` dan `/tenant/notifications`. Tambahkan konstanta ROUTES dan sidebar `Pengelolaan Notifikasi` untuk dua role tersebut. Bell/topbar tetap membuka inbox pribadi; jangan mengganti inbox dengan halaman campaign.

```text
src/sections/notification-management/
├── atoms/
│   ├── NotificationCampaignStatusBadge.tsx
│   └── NotificationChannelBadge.tsx
├── molecules/
│   ├── NotificationManagementHeader.tsx
│   ├── NotificationCampaignFilters.tsx
│   ├── NotificationCampaignTable.tsx
│   ├── NotificationContentForm.tsx
│   ├── NotificationAudiencePanel.tsx
│   ├── NotificationSchedulePanel.tsx
│   ├── NotificationPreviewPanel.tsx
│   ├── NotificationDeliveryTable.tsx
│   └── NotificationActionModal.tsx
├── organisms/
│   ├── NotificationManagementView.tsx
│   ├── NotificationCampaignFormView.tsx
│   └── NotificationCampaignDetailView.tsx
└── pages/
    └── NotificationManagementPageView.tsx
```

- [ ] Organisms memanggil hook dan menyusun molecules; molecules menyusun atoms/shared UI. Hindari wrapper tanpa manfaat.
- [ ] List memiliki search/filter/pagination, draft/edit, detail, archive, dan action sesuai status/permission.
- [ ] Form memiliki judul, rich content, ringkasan push, channel IN_APP/PUSH, audience, jadwal, preview, save draft dan send.
- [ ] Jadwal hanya bisa dipilih setelah draft tersimpan; tampilkan timezone dan validasi waktu masa depan di server.
- [ ] Sebelum send, preview menampilkan tenant, roles, jumlah penerima perkiraan, teks push, dan isi inbox.
- [ ] Detail menunjukkan progress, status per channel, kegagalan tersanitasi, audit, retry dan cancel yang eligible.
- [ ] Jika push dinonaktifkan pengguna/tidak ada perangkat, inbox tetap bisa diterima; UI menjelaskan status skipped tanpa menyebutnya berhasil push.
- [ ] Loading skeleton, toast, error/retry, respons kosong, data nihil karena filter, dan stale response ditangani.
- [ ] Reuse shared Button, TextField, SearchField, SelectField, Modal, Pagination, Table, Badge, Toast dan date/time input yang tersedia.
- [ ] Tidak ada hardcoded penerima, dummy keys, dummy report, atau angka delivery fiktif. Key memakai ID stabil.
- [ ] Responsif pada 375/414/768/1280/1440 px, semantic tokens, tema proyek, keyboard dan target sentuh 44 px.
- [ ] Semua file sumber dibuat/diubah memiliki komentar `// Files: path/file.tsx` sebelum directive client bila ada.

## Audit dan observability

- [ ] Catat create/update/send/schedule/cancel/retry/archive/override dengan actor, owner scope, target scope, campaign ID dan waktu.
- [ ] Audit platform didukung eksplisit: model audit existing mensyaratkan tenantId non-null, sehingga perlu adapter/storage platform audit yang sah; jangan menggunakan tenantId palsu.
- [ ] Log correlation job/campaign/delivery, error code, attempts, lease dan durasi; redaksi credential, device target, serta isi sensitif.
- [ ] Report paginated bersumber dari database, bukan angka Console yang diasumsikan tersedia.
- [ ] Retention campaign/delivery/device/audit ditentukan pada runbook; archive tidak menghapus bukti pengiriman.

## TDD: Red → Green → Refactor

Gunakan Vitest dan pedoman test proyek. Setiap unit test memakai Arrange–Act–Assert; domain/application memakai fake port, tidak memanggil Firebase/Moodle live.

### Red

- [ ] Domain: batas judul/content, jadwal invalid, transisi status, URL berbahaya, scope penerima.
- [ ] Application: Tenant tidak bisa lookup/send/detail campaign tenant lain; non-manager ditolak; ADMIN global scope eksplisit; schedule/edit/cancel; audience kosong; version conflict.
- [ ] Infrastructure: atomic outbox, rollback, worker claim concurrency/lease recovery, duplicate send/retry, token invalid, transient/permanent errors, sebagian batch gagal, tidak ada perangkat.
- [ ] Regresi: inbox/read/count tetap scoped, producer existing tetap bekerja, normalisasi topic consistent bila masih dipakai.
- [ ] Helpers/shared UI: JSON validation/sanitization, empty content, plain text extraction, query builder, editor reset dan read-only.

### Green

- [ ] Implement domain/ports, migration/repositories, use cases/service, controller/factory/API, worker/provider, editor lalu management UI.
- [ ] Catat hasil tiap channel secara benar dan uji worker deployment, bukan hanya unit test enqueue.
- [ ] Uji FCM integrasi di environment pengujian dengan perangkat terotorisasi; jangan broadcast ke pengguna produksi untuk validasi.

### Refactor dan verifikasi

- [ ] Cegah business rules berulang, dependency cycle, import infrastructure dari domain, dan fetch dalam molecules.
- [ ] Jalankan `npm run typecheck`, `npm run lint`, `npm run lint:barrel`, `npm run test`, `npm run build` sesuai lingkungan.
- [ ] Uji manual dua tenant berbeda, role ADMIN, role penerima, permission browser denied, foreground/background, logout/login perangkat sama, jadwal setelah restart dan partial retry.
- [ ] Sajikan kode/diff, migration, screenshot, hasil test dan runbook sebelum commit; jangan langsung commit/push/merge.

## Acceptance criteria

1. Admin dan Tenant dapat mengelola draft, preview, send, schedule, cancel, archive, dan laporan melalui Next.js.
2. Tenant tidak dapat membaca/mengubah/mengirim campaign atau memilih penerima tenant lain, termasuk request yang dimanipulasi.
3. Inbox existing dan producers tidak mengalami regresi; notifikasi management masuk inbox penerima sah.
4. Editor reusable, SSR-safe, reset/read-only bekerja, konten tersanitasi server-side dan preview aman.
5. Worker persisten memproses jadwal/outbox setelah restart dan dua worker tidak membuat inbox ganda.
6. Send/retry idempotent untuk database; potensi duplicate push akibat timeout didedupe client berdasarkan ID.
7. Report membedakan inbox created, push accepted, failed, pending, dan skipped; tidak menyamakan accepted dengan dibaca/diterima perangkat.
8. Campaign/delivery/recipient memiliki data ownership yang dapat diaudit dan API tidak mengekspos credential/device target.
9. UI management tersedia hanya bagi ADMIN/TENANT berizin; bell tetap inbox pribadi.
10. Operasional campaign tidak membutuhkan Firebase Console setelah setup awal; batas setup dan SDK terdokumentasi.
11. Test dan pemeriksaan proyek lulus, atau blocker lingkungan dijelaskan secara spesifik.

## Deliverables

- Perluasan modul notification sesuai hexagonal dan tests per lapisan.
- Migration additive, endpoints, hooks, worker dan runbook deployment.
- Management UI Admin/Tenant beserta integrasi sidebar/ROUTES/permissions.
- RichTextEditor/Field/Viewer reusable dengan schema/sanitizer dan tests.
- Bukti validasi dua tenant, editor, scheduling/retry, dan screenshot responsif.

## Referensi teknis resmi

- Firebase Admin SDK: https://firebase.google.com/docs/cloud-messaging/send/admin-sdk
- Tiptap Next.js dan SSR: https://tiptap.dev/docs/editor/getting-started/install/nextjs

Verifikasi kompatibilitas API terhadap versi dependensi yang terkunci saat implementasi; jangan menyalin contoh dokumentasi versi terbaru tanpa pemeriksaan.
