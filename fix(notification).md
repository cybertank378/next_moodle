# fix(notification): Perbaiki Pengiriman Admin/Tenant dan Lengkapi Inbox Semua Role

## Repository dan baseline

- Repository: https://github.com/cybertank378/next_moodle
- Target: `development`.
- Baseline audit: `86075a9b7e0ec96d0e6d0bad6a68e6b218c80d62`.
- Branch implementasi yang disarankan: `fix/notification-delivery-all-roles`.
- Aplikasi: **Aksaventra**.

Temuan kode di bawah mengacu pada baseline audit, bukan jaminan keadaan branch setelah commit tersebut. Periksa kembali berkas aktual sebelum implementasi. Issue ini menggantikan kebutuhan menerapkan paket patch manual; jangan menganggap patch sebelumnya sudah diterapkan atau sudah mencakup seluruh perbaikan di issue ini.

## Masalah

Pengumuman yang dikirim melalui admin dapat ditampilkan sebagai **Terkirim**, tetapi siswa tidak mendapat notifikasi inbox maupun push. Pada laporan pengguna:

```http
GET /api/notifications/count
HTTP/1.1 200 OK
```

```json
{
  "success": true,
  "data": {
    "unreadCount": 0
  }
}
```

Screenshot menunjukkan dua campaign berstatus Terkirim pada admin, sedangkan panel notifikasi siswa kosong. Respons count tersebut hanya menyatakan tidak ada inbox belum dibaca yang cocok dengan scope sesi siswa. Respons ini tidak membuktikan bahwa push sudah dikirim atau bahwa siswa masuk audiens campaign.

**Push saja tidak harus menambah inbox.** Untuk campaign **Inbox + Push**, inbox harus dibuat untuk seluruh penerima yang sah, termasuk pengguna yang tidak mengizinkan push atau belum memiliki token perangkat.

## Temuan pada kode

| Temuan | Berkas | Dampak |
| --- | --- | --- |
| Registrasi browser hanya memanggil endpoint subscribe topic | `src/modules/notification/presentation/context/NotificationContext.tsx`, `src/app/api/firebase/subscribe/route.ts` | Token tidak dipersist ke `notificationDevice`, padahal campaign menggunakan tabel ini |
| Resolver audiens mengambil perangkat aktif sebagai sumber pengguna | `src/modules/notification/infrastructure/providers/NotificationRecipientProvider.ts` | Pengguna tanpa perangkat dapat hilang dari audiens inbox |
| Resolver memiliki fallback ID buatan seperti `all_platform_admins` dan `all_students_<tenant>` | `NotificationRecipientProvider.ts` | Inbox tidak cocok dengan identitas sesi pengguna; recipient count menyesatkan |
| Scope USERS menetapkan role STUDENT dan konteks tenant berdasarkan owner tanpa lookup identitas sebenarnya | `NotificationRecipientProvider.ts` | Role/tenant penerima bisa salah dan isolasi perlu diperbaiki |
| Filter `audienceSpec.tenantIds` belum digunakan pada query perangkat platform | `NotificationRecipientProvider.ts` | Audiens tenant yang dipilih belum dipatuhi |
| Adapter mengembalikan `success: false`, tetapi dispatch tidak memeriksa hasil | `FirebaseCloudMessagingAdapter.ts`, `NotificationDispatchService.ts` | Kegagalan FCM dicatat sebagai ACCEPTED |
| Token dikelompokkan dalam satu nilai per user/role | `NotificationDispatchService.ts` | Hanya satu perangkat pengguna yang menerima push |
| Query perangkat hanya membatasi userId | `PrismaNotificationDeviceRepository.ts` | Identitas numerik yang sama pada tenant berbeda dapat tercampur |
| Semua push SKIPPED masih dapat berakhir COMPLETED | `NotificationDispatchService.ts` | UI menunjukkan keberhasilan tanpa target perangkat yang berhasil diproses |
| DELETE perangkat tidak menyelesaikan autentikasi/ownership sebelum unregister | `NotificationManagementController.ts`, `UnregisterNotificationDeviceUseCase.ts` | Token bisa dinonaktifkan tanpa pemeriksaan kepemilikan yang memadai |
| Lonceng dan provider sudah ada di layout bersama | `AppTopbar.tsx`, `AppLayout.tsx` | Perlu melengkapi integrasi, bukan membuat lonceng kedua |
| Guru belum memiliki menu inbox; link siswa belum memiliki route | `AppSidebar.tsx`, folder route teacher/student | Navigasi notifikasi belum lengkap |
| Admin/tenant memiliki pengelolaan campaign tetapi belum inbox pribadi terpisah | Route admin/tenant | Notifikasi yang diterima tercampur dengan konsep pengelolaan |
| Service worker memiliki fallback konfigurasi Firebase statis | `public/firebase-messaging-sw.js` | Risiko ketidaksesuaian project dengan konfigurasi client/server |

Temuan ini berasal dari pemeriksaan repository. Database, credential, log FCM, dan pengiriman pada lingkungan pengguna belum diperiksa; jangan menyatakan bahwa masalah konfigurasi produksi sudah terbukti.

## Tujuan

1. Campaign admin/tenant menjangkau audiens yang benar sesuai scope dan izin.
2. Inbox dapat diterima tanpa ketergantungan pada izin push atau token perangkat.
3. Push menggunakan semua perangkat aktif yang sah dan hasil provider dicatat akurat.
4. ADMIN, TENANT, TEACHER, PROCTOR dan STUDENT memiliki menu inbox serta lonceng yang berfungsi.
5. Pengelolaan dan diagnosis pengiriman tersedia melalui Next.js tanpa memerlukan Firebase Console untuk operasi harian.
6. Implementasi tetap mengikuti hexagonal architecture, Atomic Design, shared UI, dan API hook yang tersedia.

## A. Resolver audiens dan identitas

- Jadikan sumber pengguna/role yang tepercaya sebagai sumber audiens. Pengguna aplikasi berasal dari integrasi Moodle; jangan mengasumsikan ada model User lokal di Prisma.
- Reuse client factory, credential tenant, repository pengguna, dan adapter Moodle yang sesuai. Jika API yang tersedia tidak memberikan role aplikasi secara akurat, tambahkan port/adapter yang diperlukan dan dokumentasikan kontraknya. Jangan menebak role dari username atau menganggap semua pengguna STUDENT.
- Normalisasi identitas harus sama dengan identitas pada `resolveCurrentActor` dan `NotificationScope`: `recipientId/userId`, role aplikasi, dan tenantId.
- ID Moodle numerik tidak unik lintas instance tenant. Gunakan scope komposit; jangan menggabungkan ID yang sama dari tenant berbeda.
- Deduplikasi berdasarkan identitas lengkap, bukan userId saja.
- Hilangkan seluruh fallback ID penerima buatan dan nama placeholder yang menggantikan lookup sebenarnya.
- Lookup yang gagal harus menghasilkan error yang dapat ditindaklanjuti; jangan berubah menjadi daftar kosong atau hitungan palsu.
- Definisikan kebijakan akun tidak aktif/suspended/deleted dan terapkan konsisten pada preview, dispatch, serta retry.
- Gunakan pagination/batching saat mengambil audiens besar. Jangan membatasi seluruh audiens secara diam-diam pada 100 tenant atau satu halaman pengguna.

### Aturan scope

| Scope | Perilaku yang wajib |
| --- | --- |
| ALL | Semua pengguna yang eligible dalam cakupan actor/campaign sesuai kebijakan yang terdokumentasi |
| TENANT | Pengguna tenant yang dipilih; platform admin dapat memilih tenant sah; tenant owner hanya tenant sendiri |
| ROLES | Role yang diminta dalam cakupan tenant/platform yang diizinkan |
| USERS | Lookup user yang sebenarnya, validasi tenant dan role, lalu gunakan identitas hasil lookup |

- Untuk tenant campaign, ownerTenantId dari server selalu membatasi cakupan; payload client tidak boleh memperluasnya.
- Validasi kombinasi scope, tenantIds, roles, dan userIds; tolak kombinasi ambigu/tidak sah.
- Definisikan bagaimana USERS membedakan userId yang sama lintas tenant, misalnya pasangan tenantId + userId. Jika DTO berubah, perbarui UI, validator, mapper, dan dokumentasi bersamaan.
- Preview count dan dispatch memakai aturan resolver yang sama. Jika audiens berubah setelah preview, perbarui/invalidasi estimasinya.
- Recipient count adalah jumlah identitas penerima, bukan jumlah perangkat. Sediakan hitungan pengguna eligible push dan jumlah perangkat terpisah jika dibutuhkan.

## B. Registrasi dan lifecycle token perangkat

- Gunakan `POST /api/notifications/devices` untuk persist token setelah izin browser diberikan.
- Token diikat ke userId, role, tenantId dari sesi server. Tolak ownership dari payload client.
- Jangan menandai setup berhasil sebelum API perangkat sukses. Tampilkan error dan tombol Coba Lagi/Sinkronkan perangkat.
- Pertahankan kompatibilitas topic subscription untuk event notifikasi lama yang masih memakai topic. Tentukan satu alur registrasi yang jelas; hindari dua jalur yang tampak sukses tetapi tidak konsisten.
- Endpoint topic lama memiliki bentuk respons berbeda dari envelope API utama; samakan kontraknya atau parse sesuai kontrak sebenarnya.
- Registrasi bersifat idempotent/upsert, memperbarui `lastSeenAt` dan reaktivasi yang sah.
- Permission `granted` memicu registrasi pasif saat login/reload; `default` meminta izin hanya melalui aksi pengguna.
- Jangan menampilkan notifikasi sebagai aktif hanya berdasarkan izin browser jika registrasi server gagal.
- Logout/switch account melepaskan subscription dan menonaktifkan perangkat yang dimiliki sesi lama secara aman. Jangan membiarkan token akun bersama mengirim informasi akun sebelumnya.
- `DELETE /api/notifications/devices` wajib autentikasi dan memeriksa userId + role + tenantId + token. Jangan menonaktifkan token milik actor lain.
- Tangani token invalid/unregistered: nonaktifkan perangkat yang sesuai dan catat error terminal tanpa retry tanpa batas.
- Bedakan kegagalan sementara provider dengan token invalid atau credential/project mismatch.
- Konfirmasi client config, service worker config, VAPID, dan Firebase Admin menggunakan project yang sama. Hindari fallback ke project statis yang tidak sesuai deployment.
- Service worker terdaftar sebelum `getToken`; bila memakai konfigurasi dinamis, teruskan registration yang benar ke `getToken`.
- Jelaskan kebutuhan secure context: HTTPS untuk deployment, sedangkan localhost dapat digunakan untuk pengembangan browser yang mendukung.

## C. Dispatch inbox dan push

### Inbox

- Untuk kanal IN_APP, buat record bagi semua penerima eligible hasil resolver, meskipun tidak ada perangkat.
- Record harus memiliki recipientId, recipientRole, dan tenantId yang cocok dengan query list/count/mark-read.
- Jangan membuat inbox bagi ID pseudo-broadcast yang tidak dikenali scope pembacaan.
- Inbox-only tidak memanggil FCM. Push-only tidak membuat inbox secara implisit.
- Detail pengumuman harus dapat dibuka oleh penerima yang sah. Link `/announcements/<id>` yang belum mempunyai route tidak boleh menghasilkan 404; sediakan route detail dengan authorization atau arahkan ke detail inbox yang tersedia.
- Jangan memperlihatkan HTML yang belum disanitasi; gunakan konten aman sesuai kontrak modul.

### Push

- Query perangkat dengan identitas lengkap userId + role + tenantId dan `active: true`.
- Kirim ke seluruh token aktif yang berbeda; satu user dapat memiliki beberapa perangkat.
- Deduplicate token; jangan menimpa token perangkat lain dalam Map satu nilai.
- Periksa hasil adapter: `success: false`/outcome FAILED wajib menghasilkan FAILED delivery.
- ACCEPTED hanya setelah provider menerima request, dengan `providerMessageId` bila tersedia.
- ACCEPTED bukan bukti perangkat menerima, menampilkan, atau membaca notifikasi.
- Jika adapter tidak mendukung operasi yang dipakai, laporkan error konfigurasi, bukan sukses.
- `NO_ACTIVE_DEVICE` tercatat SKIPPED. Bedakan nol audiens dengan audiens yang tidak memiliki perangkat.
- Jangan menampilkan sukses kirim push apabila seluruh target kosong/skipped/gagal. Tetapkan kebijakan agregasi campaign dan label UI secara eksplisit.
- Untuk Inbox + Push dengan inbox berhasil dan push gagal/skipped, tampilkan ringkasan per kanal agar status agregat tidak menyembunyikan masalah push.
- Selaraskan payload campaign dengan listener foreground dan service worker: identifier, judul, body, dan link yang sah.
- Saat tab aktif, refresh inbox/count serta tampilkan feedback UI sesuai pola proyek. Jangan menganggap browser otomatis menampilkan popup OS pada foreground.
- Background notification tidak boleh tampil dua kali ketika payload notification sudah ditangani SDK.
- Pengiriman besar memakai batch dengan batas provider dan concurrency terkontrol.

## D. Outbox, penjadwalan, dan retry

Baseline send mengantrekan outbox sekaligus menjalankan dispatch langsung. Pastikan pengiriman tidak dieksekusi ulang oleh worker menjadi inbox/push duplikat.

- Tentukan satu mekanisme eksekusi yang jelas: worker sebagai dispatcher atau dispatch langsung dengan penyelesaian job dan claim/idempotensi yang benar.
- Persist perubahan campaign dan enqueue secara atomik bila memungkinkan.
- Tambahkan idempotensi pada delivery/inbox per campaign + identitas + kanal/perangkat; worker restart tidak menggandakan data.
- Jadwal harus diproses oleh worker/cron yang benar-benar dijalankan pada deployment. Definisi class worker saja belum cukup.
- Dokumentasikan command/entrypoint, interval, timezone, lease, dan cara menjalankan worker sesuai lingkungan hosting.
- Worker concurrent memakai claim/lease yang aman dan memiliki recovery job yang macet.
- Retry hanya delivery yang retryable; jangan mengirim ulang delivery ACCEPTED atau membuat ulang inbox yang sudah ada.
- Periksa `RetryNotificationDeliveryUseCase` agar tidak melakukan pengiriman target yang berbeda dari laporan delivery asli.
- Cancel/arsip/jadwal mengikuti state transition yang sah; worker menghormati campaign yang dibatalkan.
- Tidak boleh memperbaiki record historis dengan mengirim ulang campaign otomatis ke semua pengguna. Sediakan tindakan eksplisit yang aman bila diperlukan.

## E. Sidebar, lonceng, dan inbox semua role

Reuse `AppLayout`, `AppTopbar`, `NotificationProvider`, badge, panel, list, dan tabs yang sudah ada. Jangan membuat provider terpisah untuk sidebar dan lonceng karena dapat menyebabkan polling dan state berbeda.

| Role | Menu inbox pribadi yang disarankan | Route | Pengelolaan campaign |
| --- | --- | --- | --- |
| ADMIN | Notifikasi Saya | `/admin/inbox` | `/admin/notifications` |
| TENANT | Notifikasi Saya | `/tenant/inbox` | `/tenant/notifications` |
| PROCTOR | Notifikasi Saya | `/proctor/inbox` | `/proctor/notifications` |
| TEACHER | Notifikasi | `/teacher/notifications` | Tidak diberikan melalui issue ini |
| STUDENT | Notifikasi | `/student/notifications` | Tidak diberikan melalui issue ini |

- Seluruh role mempunyai lonceng terlihat dan dapat digunakan, termasuk mobile.
- Seluruh link sidebar mempunyai halaman nyata dan dijaga layout/auth role yang sesuai.
- Management dan inbox pribadi dipisahkan untuk admin/tenant.
- Sidebar dan footer panel lonceng memakai route constants yang sama.
- Lonceng memiliki badge count aktual, accessible label, expanded state, dan target panel.
- Panel menyediakan belum dibaca/sudah dibaca, mark-read/mark-all-read, pagination, loading, empty state, dan error/retry.
- Tambahkan “Lihat semua notifikasi” menuju inbox role aktif.
- Close via Escape/outside click; klik tombol lonceng tidak menimbulkan race toggle. Focus dikembalikan ke trigger jika sesuai pola panel.
- Inbox penuh menyediakan refresh, status baca, pagination, detail, dan pengaturan izin push dengan feedback registrasi.
- Provider diisolasi dengan userId + role + tenantId, bukan username saja. Bersihkan hasil lama dan cegah respons asynchronous akun lama menimpa sesi baru.
- Count tidak boleh diubah menjadi angka palsu untuk membuat badge muncul. Jika gagal, bedakan error dari count 0.
- Pertahankan empty state yang informatif dan shell halaman; tanpa dummy data atau random/index key untuk data dinamis.

## F. Struktur dan batas arsitektur

```text
src/modules/notification/
├── application/
│   ├── services/
│   └── usecases/
├── domain/
│   ├── dto/
│   ├── entity/
│   ├── interfaces/
│   ├── mapper/
│   ├── types/
│   └── value-object/
├── infrastructure/
│   ├── http/
│   ├── providers/
│   ├── repo/
│   ├── validators/
│   └── workers/
├── presentation/
│   ├── context/
│   └── hooks/
└── __tests__/
    ├── application/
    ├── domain/
    ├── infrastructure/
    └── presentation/

src/sections/notification/
├── atoms/
├── molecules/
├── organisms/
└── __tests__/
```

- Ikuti struktur aktual modul dan naming/file-header proyek; daftar ini tidak mewajibkan folder kosong.
- Application memakai port domain, bukan Firebase/Prisma/Moodle SDK secara langsung.
- Adapter pengguna Moodle, repository Prisma, dan adapter FCM berada di infrastructure dan di-inject melalui factory.
- Client tidak mengakses database, credential tenant, atau service-account Firebase.
- Pages memasang organism; organisms menyusun molecules; molecules menyusun atoms/shared UI sesuai tanggung jawab.
- Reuse `useNotificationApi`, `useNotificationManagementApi`, DTO, Button, Pagination, Modal, Toast, dan komponen field yang tersedia.
- Shell notifikasi tidak menambahkan management permission untuk siswa/guru.
- Perubahan schema/unique key/index disertai migration yang aman untuk data lama, termasuk deduplikasi terencana sebelum unique constraint.

## G. Ketentuan wajib penggunaan shared UI

Seluruh kontrol dan pola UI dalam issue ini wajib menggunakan komponen yang tersedia di **`src/shared-ui/component/`**. Pada baseline repository, lokasi tersebut merupakan direktori berisi berkas `.tsx`, bukan menggunakan html native component. Jangan membuat berkas monolitik baru hanya untuk mengikuti penulisan path tersebut.

Ketentuan ini berlaku pada halaman inbox, panel lonceng, sidebar/topbar yang disentuh, pengaturan push, form campaign yang disentuh, preview, laporan delivery, modal konfirmasi, serta semua state loading/error/empty.

| Kebutuhan UI | Komponen shared yang harus diperiksa dan dipakai |
| --- | --- |
| Tombol dan tombol ikon, termasuk lonceng/refresh/close | `Button.tsx` |
| Aksi navigasi berbentuk tombol |  `Button` dengan `asChild` yang didukung |
| Input teks | `TextField.tsx` |
| Ringkasan/textarea | `TextAreaField.tsx` |
| Pencarian | `SearchField.tsx` |
| Select/filter pilihan | `SelectField.tsx` |
| Tanggal/jadwal | `DatePicker.tsx` dan komponen waktu shared bila tersedia |
| Pilihan kanal dan pengaturan | `Checkbox.tsx`, `Radio.tsx`, `Switch.tsx` sesuai semantik |
| Label, helper, dan error form | `Form/FormLabel.tsx`, `Form/FormHelperText.tsx`, `Form/FormError.tsx`, `Form/FormControl.tsx` |
| Layout form | `Form/FormLayout.tsx`, `Form/FormGrid.tsx`, `Form/FormSection.tsx` sesuai kebutuhan |
| Status/kanal/role | `Chip.tsx` atau `RoleBadge.tsx` sesuai API dan makna komponen |
| Kartu/panel | `Card.tsx` atau `ExpandableCard.tsx` sesuai kebutuhan |
| Tabel delivery/campaign | `Table.tsx` |
| Pagination | `Pagination.tsx` |
| Keadaan loading | `Skeleton.tsx` |
| Data kosong | `EmptyState.tsx` |
| Modal detail/konfirmasi | `Modal.tsx` |
| Feedback operasi | `Toast.ts`/`toastHandler.ts` sesuai pola proyek |
| Avatar dan dropdown | `Avatar.tsx`, `AvatarDropdown.tsx`, `DropdownItem.tsx` sesuai kebutuhan |
| Separator | `Divider.tsx` |
| Konten rich text | `RichTextEditor`/`RichTextViewer` yang tersedia |

- Periksa props, export, variant, accessibility, dan contoh penggunaan aktual sebelum integrasi; jangan menebak kontrak komponen.
- Tidak menggunakan native `button`, `input`, `textarea`, atau `select` langsung dalam section/layout yang diubah jika komponen shared sudah menyediakan perilaku tersebut.
- Jangan membuat ulang tabel, modal, toast, field, pagination, badge, skeleton, atau empty state dengan markup lokal yang menduplikasi shared UI.
- Markup semantik untuk struktur halaman seperti `section`, `header`, `nav`, heading, paragraf, dan wrapper layout tetap diperbolehkan. Aturan reuse tidak mewajibkan setiap elemen HTML menjadi komponen baru.
- Atoms domain seperti NotificationBadge/NotificationItem boleh tetap ada, tetapi harus menyusun shared UI jika sesuai. Molecules menyusun atoms/shared UI; organisms menyusun molecules dan mengoordinasikan state.
- Jika shared component belum mendukung kebutuhan, perluas secara backward-compatible atau tambahkan komponen reusable di direktori shared tersebut. Sertakan alasan dan verifikasi penggunaan existing consumer; jangan menambahkan pengganti lokal dalam halaman notifikasi.
- State kosong tetap memakai EmptyState dan aset yang benar-benar tersedia; error tidak boleh disamarkan menjadi empty state.
- Tambahkan tabel inventaris pada PR: kebutuhan, komponen shared, berkas pengguna, serta perubahan props jika ada. Reviewer harus dapat memeriksa reuse tanpa menelusuri seluruh halaman.

### Checklist shared UI

- [ ] Seluruh tombol termasuk lonceng, mark-read, refresh, permission, close, dan pagination memakai komponen shared yang sesuai.
- [ ] Field/filter, pilihan kanal, dan jadwal memakai shared field/control.
- [ ] Badge, tabel, kartu, modal, skeleton, empty state, dan toast memakai shared component.
- [ ] Tidak ada duplikasi primitive UI atau import dari path `src/shared-ui/component/*.tsx` yang tidak tersedia.
- [ ] Komponen shared yang diperluas tetap kompatibel dengan pemakai lama.
- [ ] Inventaris reuse dilampirkan pada PR dan diperiksa saat review.

## H. Observabilitas melalui aplikasi

- Laporan delivery menampilkan audiens sebenarnya, jumlah inbox dibuat, pengguna eligible push, perangkat ditarget, accepted, failed, skipped, dan alasan skipped.
- Detail kegagalan menyediakan kode error yang berguna tanpa secret atau token lengkap.
- Log terstruktur memuat campaignId, jobId, kanal, attempt, dan scope yang relevan; token harus disamarkan.
- UI tidak mengandung label “Data contoh” atau angka contoh dari mockup.
- Informasi konfigurasi yang diperlukan didokumentasikan di `.env.example`/README tanpa memasukkan credential sebenarnya.
- Admin dapat membedakan permission denied, unsupported browser, no device, invalid token, credential mismatch, job belum diproses, dan provider failure.

## Skenario reproduksi dan validasi

1. Login ADMIN dan STUDENT dari sesi/browser berbeda.
2. Buat campaign untuk tenant siswa dengan kanal Inbox + Push.
3. Catat hasil preview audiens, response send, status campaign, dan laporan delivery.
4. Pada siswa, periksa GET list/count, panel lonceng, halaman inbox, dan registrasi perangkat.
5. Ulangi dengan siswa yang belum memberi izin push: inbox tetap harus ada, push ditandai skipped.
6. Ulangi dengan Push saja: count inbox tidak bertambah, tetapi push ditargetkan ke perangkat yang eligible.
7. Ulangi untuk TENANT dan TEACHER serta beberapa perangkat user yang sama.
8. Ulangi untuk userId Moodle yang sama pada dua tenant: tidak ada data/push lintas tenant.

## Pengujian wajib

### Domain/application

- [ ] Resolver ALL/TENANT/ROLES/USERS menggunakan identitas valid dan menerapkan batas tenant.
- [ ] Inbox dibuat untuk penerima tanpa perangkat; count sesuai scope sesi.
- [ ] Tidak ada fallback ID buatan atau role hasil tebakan.
- [ ] Push dikirim ke semua token berbeda; hasil `success: false` tidak menjadi ACCEPTED.
- [ ] Missing device/zero audience/provider unavailable memiliki hasil yang eksplisit.
- [ ] Agregasi status kanal campuran tidak menyembunyikan kegagalan push.
- [ ] Retry/idempotensi tidak menggandakan inbox atau delivery sukses.

### Infrastructure/API

- [ ] Registrasi token memakai actor server, idempotent, dan memperbarui lifecycle.
- [ ] Unregister tanpa sesi ditolak; token milik actor lain tidak berubah.
- [ ] Query perangkat mengisolasi userId + role + tenantId.
- [ ] Semua endpoint management melindungi akses campaign/audiens, termasuk request yang dimanipulasi.
- [ ] Token invalid dinonaktifkan; error sementara retry dengan backoff terbatas.
- [ ] Worker claim/recovery/schedule/cancel diuji tanpa pengiriman duplikat.
- [ ] Config service worker dan client cocok; payload foreground/background serta click URL tervalidasi.

### Presentation/navigation

- [ ] Semua empat role mempunyai menu inbox dengan route yang ada.
- [ ] Lonceng menggunakan count API dan membuka panel, footer menuju inbox role aktif.
- [ ] Loading, API error, nol data, izin denied/unsupported, dan registrasi gagal ditampilkan dengan benar.
- [ ] Pergantian akun/tenant tidak membocorkan state atau response lama.
- [ ] Mobile/desktop, keyboard, Escape/outside click, serta focus dapat digunakan.
- [ ] Tidak ada dummy data, broken asset, atau random key.

## Kriteria penerimaan

- [ ] Admin mengirim Inbox + Push kepada audiens tenant yang benar; semua penerima eligible mendapat inbox walau tidak punya token.
- [ ] Siswa/guru/tenant/admin dapat membaca notifikasi melalui sidebar dan lonceng sesuai scope sesi.
- [ ] Count 0 hanya tampil bila hasil API menyatakan tidak ada inbox belum dibaca, bukan karena error yang disembunyikan.
- [ ] Push dikirim ke seluruh perangkat aktif yang sah, dengan status provider yang akurat.
- [ ] Campaign tanpa push berhasil tidak dilabeli sukses kirim push; laporan menjelaskan accepted/failed/skipped per kanal.
- [ ] Tidak ada akses lintas tenant, manipulasi ownership token, atau audiens yang menggunakan ID buatan.
- [ ] Jadwal dan retry benar-benar diproses, idempotent, dan memiliki cara menjalankan worker terdokumentasi.
- [ ] Pengelolaan, preview audiens, dan diagnosis pengiriman dapat dilakukan dari Next.js.
- [ ] Typecheck, lint sesuai standar repo, dan test terkait lulus; build berhasil dengan konfigurasi valid.
- [ ] Lampirkan bukti uji end-to-end admin ke siswa/guru/tenant, termasuk pengguna tanpa izin push dan multi perangkat.

## Urutan implementasi

1. Audit ulang baseline terkini, identitas sesi, kontrak Moodle role/user, endpoint, schema, dan deployment worker.
2. Perbaiki resolver audiens serta tenant isolation; uji preview dan inbox tanpa perangkat.
3. Perbaiki registrasi/lifecycle perangkat serta konfigurasi service worker.
4. Perbaiki hasil adapter, multi perangkat, agregasi status, outbox/idempotensi, schedule, dan retry.
5. Lengkapi sidebar, inbox setiap role, lonceng, dan feedback push menggunakan komponen yang tersedia.
6. Jalankan pengujian, dokumentasikan konfigurasi, dan lampirkan bukti UI serta laporan delivery.

## Di luar lingkup

- Redesign login atau mengganti logo.
- Penambahan kanal email/SMS.
- Menganggap FCM ACCEPTED sebagai bukti delivered/read.
- Mengirim ulang campaign historis secara otomatis.

## Checklist review

- [ ] Judul dan deskripsi PR menjelaskan bug pengiriman serta perubahan navigasi.
- [ ] Seluruh perubahan API/DTO/schema didokumentasikan dan kompatibilitas diperiksa.
- [ ] Source code final mengikuti hexagonal architecture dan Atomic Design.
- [ ] Screenshot inbox/panel lonceng untuk seluruh role dan laporan delivery tersedia.
- [ ] Hasil test/build serta batas validasi lingkungan dicantumkan.
- [ ] Tidak ada credential atau token perangkat lengkap di source/log/screenshot.
