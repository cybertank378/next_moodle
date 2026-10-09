# fix(notification): Perbaiki Konsistensi Inbox, Lifecycle Perangkat FCM, dan Fondasi Editor Tiptap

## Referensi dan tujuan

- Repository: https://github.com/cybertank378/next_moodle/tree/development
- Baseline audit: `d08713f2d5b8f75196f32a454f2a39a987c8a0ef`.
- Jenis: bug fixes dan refactor fondasi sebelum implementasi management campaign.
- Temuan berasal dari inspeksi kode; reproduksi runtime dan regression tests wajib dilakukan sebelum menyatakan bug terselesaikan.

Perbaiki ketidakkonsistenan badge/inbox, pencatatan kegagalan push, lifecycle perangkat, dan penggunaan Tiptap agar modul notification dapat diperluas dengan aman untuk Admin dan Tenant.

Issue ini tidak membangun seluruh management campaign. Draft, audience management, penjadwalan campaign, dan laporan campaign lengkap mengikuti issue management notifikasi tersendiri. Outbox pada issue ini merupakan fondasi pengiriman notifikasi existing yang dapat digunakan kembali oleh campaign.

## Temuan dan prioritas

| Prioritas | Temuan kode | Dampak/risiko | Target |
| --- | --- | --- | --- |
| P1 | Producer fire-and-forget dan adapter menangkap error FCM tanpa meneruskan hasil | Pengiriman gagal tidak tercatat secara andal | Outbox, worker persisten, typed dispatch result |
| P1 | Belum terlihat unregister perangkat/subscription pada hook | Subscription akun lama berpotensi tertinggal saat pergantian akun | Registrasi ownership dan cleanup logout/rotasi |
| P1 | Mutasi read memperbarui badge tanpa memeriksa respons API | UI menyatakan sudah dibaca meski mutasi gagal | Success handling atau rollback |
| P1 | Foreground handler memasukkan payload tanpa cek tab/page/duplikasi | Pesan unread masuk tab read, badge berlebih, pagination tidak konsisten | Validasi payload, dedupe, refetch terkoordinasi |
| P2 | Topbar dan NotificationPanel masing-masing memakai hook stateful | Polling/listener ganda dan badge berbeda | Satu provider/store per sesi |
| P2 | Firebase config service worker hardcoded | Client dan worker dapat mengarah ke project berbeda | Konfigurasi environment konsisten |
| P2 | Normalisasi topic subscribe berbeda dari dispatch | Kegagalan routing untuk identitas tertentu | Satu helper topic bila topic dipertahankan |
| P2 | Tiptap berada dalam QuestionEditor dan belum memakai konfigurasi SSR yang disarankan | Risiko hydration dan state edit tidak sinkron | Editor reusable dan sinkronisasi value |
| P2 | Repository memakai any dan mapper tenantId non-null | Type safety tidak sesuai platform scope | Adapter Prisma bertipe dan nullable tenantId |
| P2 | Panel fixed 360px dan belum terlihat Escape/focus handling | Risiko overflow serta navigasi keyboard tidak lengkap | Panel responsif dan aksesibel |

## File acuan

- `src/modules/notification/presentation/hooks/useNotificationApi.ts`
- `src/modules/notification/application/usecases/CreateNotificationUseCase.ts`
- `src/modules/notification/infrastructure/providers/FirebaseCloudMessagingAdapter.ts`
- `src/modules/notification/infrastructure/repo/PrismaNotificationRepository.ts`
- `src/modules/notification/domain/interfaces/PushNotificationAdapterInterface.ts`
- `src/modules/notification/domain/value-object/NotificationScope.ts`
- `src/app/api/firebase/subscribe/route.ts`
- `src/libs/firebase.ts`
- `public/firebase-messaging-sw.js`
- `src/shared-ui/layout/AppTopbar.tsx`
- `src/sections/notification/organisms/NotificationPanel.tsx`
- `src/sections/questions/organisms/QuestionEditor.tsx`

Periksa HEAD dan perubahan setelah baseline sebelum mengedit. Pertahankan folder `src/modules/notification` existing; jangan membuat modul duplikat.

## 1. Konsistensi state inbox dan badge

- [ ] Buat satu provider/store notifikasi per sesi authenticated, dipasang pada layout bersama yang sesuai.
- [ ] Topbar dan panel membaca instance state yang sama. Hook publik menjadi consumer provider; tidak memasang polling/listener ulang per consumer.
- [ ] Reset state dan batalkan operasi lama saat actor/tenant/sesi berubah; respons akun sebelumnya tidak boleh muncul pada akun baru.
- [ ] Cek hasil mark-as-read dan mark-all-as-read sebelum memperbarui badge/list. Jika optimistic, implement rollback dan error feedback.
- [ ] Tandai read secara idempotent; klik berulang tidak mengurangi badge lebih dari sekali.
- [ ] Mark-all menjaga activeTab/page konsisten dan memperbarui daftar yang sedang ditampilkan.
- [ ] Untuk pesan foreground, validasi data, dedupe ID, lalu invalidate/refetch daftar dan count secara terkoordinasi. Jangan increment badge secara buta.
- [ ] Pertahankan tab, filter, page size dan totalPages yang benar; refetch tidak memasukkan unread ke tab read.
- [ ] Gunakan abort atau request sequence untuk mencegah respons tab/page lama menimpa pilihan terbaru.
- [ ] Polling hanya satu per sesi, tidak overlap, berhenti saat sesi berakhir; kurangi/pause saat tab tersembunyi dan revalidate saat kembali aktif.
- [ ] Cleanup async Firebase setup juga menangani unmount sebelum listener selesai dibuat.
- [ ] Hapus `as any` pada payload foreground; mapping bertipe mengikuti DTO.

## 2. Lifecycle perangkat dan izin push

- [ ] Pindahkan `Notification.requestPermission()` ke aksi eksplisit pengguna, misalnya tombol `Aktifkan notifikasi`.
- [ ] Tampilkan kondisi unsupported, permission default/denied/granted, belum terkonfigurasi dan gagal registrasi. Inbox tetap berfungsi tanpa push.
- [ ] Registrasi perangkat mengikat target FCM ke actor dari sesi server, bukan userId/tenantId yang dipercaya dari client.
- [ ] Tambahkan unregister saat logout/pergantian akun dan rotasi target. Integrasikan cleanup server dengan lifecycle sesi; jangan hanya mengandalkan hook unmount.
- [ ] Saat browser offline ketika logout, registrasi lama tetap harus dapat dipulihkan/dinonaktifkan; UI tidak menampilkan isi pesan sensitif dalam push yang dapat bertahan setelah sesi berakhir.
- [ ] Untuk notifikasi pribadi, utamakan target perangkat terotorisasi. Topic yang mudah ditebak bukan bukti authorization.
- [ ] Audit migration dari alur `/api/firebase/subscribe`. Jika topic tetap dipakai untuk pengumuman non-sensitif, kelola subscribe/unsubscribe dan gunakan normalisasi tunggal.
- [ ] Uji bahwa perangkat yang berpindah dari akun A ke B tidak tetap ditargetkan ke A setelah cleanup berhasil.
- [ ] Jangan mengekspos device token/credential pada response management atau log.

## 3. Pengiriman yang dapat ditelusuri

- [ ] Ganti dispatch result void/error yang ditelan dengan typed outcome untuk accepted/failed/skipped serta error retryable/non-retryable.
- [ ] Simpan inbox dan outbox job atomik di database, lalu proses menggunakan worker persisten.
- [ ] Pertahankan kontrak producer existing sejauh memungkinkan; perubahan signature diuji pada seluruh pemanggil.
- [ ] Worker menggunakan claim atomic/lease, checkpoint, batching, retry terbatas dengan backoff+jitter, dan pemulihan setelah restart.
- [ ] Perubahan database additive: outbox/attempt metadata dan device ownership bila diperlukan, tanpa reset database.
- [ ] Dedupe job/inbox berdasarkan ID/idempotency key; retry kegagalan push tidak membuat inbox baru.
- [ ] Setelah timeout provider, hasil dapat ambigu; jangan menjanjikan exactly-once push. Dedupe browser/service worker berdasarkan notification ID.
- [ ] Bedakan inbox tersimpan, FCM accepted, failed, skipped-no-device, dan read. Accepted bukan bukti diterima perangkat atau dibaca.
- [ ] Kegagalan konfigurasi Firebase dilaporkan secara jelas; jangan menghasilkan sukses push palsu.
- [ ] Domain/application tetap memakai port; Prisma, Firebase dan Next.js hanya di infrastructure/composition root.
- [ ] Tambahkan runbook worker, environment, retry, backlog, dan pemulihan lease. Jangan menggantungkan proses pada fire-and-forget route Next.js.

## 4. Konfigurasi Firebase dan service worker

- [ ] Satukan sumber konfigurasi client/service worker per environment melalui build-generated config atau mekanisme deployment yang terdokumentasi; env tidak otomatis tersedia pada file static public.
- [ ] Firebase Admin memakai provider server-only bersama dan credential server-side. Konfigurasi web publik tidak diperlakukan sebagai service-account secret.
- [ ] Verifikasi kompatibilitas versi SDK client dan service worker; jangan memperbarui hanya demi menyamakan nomor versi tanpa pengujian.
- [ ] Audit background notification yang membawa `notification` payload sekaligus memanggil `showNotification`; reproduksi dan cegah tampilan ganda.
- [ ] Tambahkan notification ID/tag dan click handler untuk path internal yang tervalidasi. Authorization tetap dicek pada halaman tujuan.
- [ ] Redaksi payload log dan uji foreground/background pada HTTPS dengan konfigurasi environment pengujian.
- [ ] Jika topic masih digunakan, helper server menghasilkan nama yang identik pada subscribe dan dispatch, dengan collision handling yang jelas.

## 5. Repository dan batas akses

- [ ] Ganti `db: any` dengan dependency client/port Prisma minimal yang bertipe dan tetap mudah dimock.
- [ ] Mapper mendukung `tenantId: string | null`, mengikuti schema dan platform scope.
- [ ] Pertahankan isolasi tenant, recipientId dan recipientRole pada query.
- [ ] Read mutation tidak boleh berhasil untuk notifikasi aktor lain; scoped update atomik di repository dianjurkan bersama guard use case.
- [ ] Uji ADMIN tenantId null, dua tenant berbeda, ID tidak ditemukan, serta mark-read berulang.

## 6. Panel dan aksesibilitas

- [ ] Ganti tombol native section dengan shared Button mengikuti kontrak komponen proyek.
- [ ] Lebar panel dibatasi viewport; tidak menyebabkan overflow pada 375/414 px.
- [ ] Tambahkan Escape, fokus awal/pengembalian fokus, aria-expanded/controls pada pemicu, serta semantik panel yang sesuai.
- [ ] Gunakan focus trap hanya bila panel benar-benar modal; jangan memasang role menu pada konten yang bukan pola menu.
- [ ] State loading/error/retry/empty jelas, action read memiliki busy state, dan navigasi notification tidak memalsukan hasil read yang gagal.
- [ ] Ikuti semantic tokens, tema proyek dan target sentuh 44 px.

## 7. Fondasi Tiptap reusable

Target usulan:

```text
src/shared-ui/component/RichTextEditor/
├── RichTextEditor.tsx
├── RichTextEditorToolbar.tsx
├── RichTextEditorField.tsx
├── RichTextViewer.tsx
├── RichTextEditorTypes.ts
└── richTextEditorExtensions.ts
```

- [ ] Gunakan dependensi Tiptap existing dan `immediatelyRender: false` pada komponen client.
- [ ] Kontrak reusable: value/onChange, disabled/readOnly, placeholder, label/aria, helper/error, maxLength dan fitur toolbar.
- [ ] Value JSON aplikasi menjadi sumber editor baru; HTML untuk API Questions existing diturunkan melalui adapter kompatibilitas agar kontrak backend tidak diubah diam-diam.
- [ ] Sinkronkan pergantian existingQuestion/reset dan gunakan functional state update agar perubahan editor tidak menimpa field form lain.
- [ ] Tidak reset content/cursor setiap ketikan, tidak emit loop saat setContent eksternal; toolbar mengikuti selection aktual.
- [ ] Refactor QuestionEditor menggunakan shared editor; pastikan data questionId/category berubah tidak membawa konten sebelumnya.
- [ ] Validasi empty rich text, ukuran/depth dokumen, node/mark allowlist dan URL aman pada server. Sanitasi hasil HTML sebelum viewer/render.
- [ ] Viewer dan toolbar reusable tanpa dependency notification/questions; shared Button untuk toolbar dan accessible labels.
- [ ] Tahap awal tanpa raw HTML, iframe, embed, upload gambar, kolaborasi atau Tiptap Cloud.

## Struktur pengujian dan TDD

Ikuti folder existing `src/modules/notification/__tests__/{application,domain,infrastructure,helpers}` dan struktur tests shared-ui yang ada. Gunakan Vitest, Arrange–Act–Assert, fake ports untuk unit test, serta mock SDK untuk pengujian adapter.

### Red

- [ ] Reproduksi read gagal namun badge berubah; pesan foreground ketika tab read; payload ID berulang; response tab/page usang.
- [ ] Reproduksi dua consumer menghasilkan polling/listener ganda dan pergantian actor ketika request masih berjalan.
- [ ] Uji FCM transient/permanent failure, no-device, lease expiration, dua worker dan retry tanpa inbox ganda.
- [ ] Uji registrasi/unregister perangkat dua akun, tenant scope dan platform scope null.
- [ ] Uji editor SSR, reset/edit item berbeda, stale form state, empty text dan XSS/malformed content.

### Green

- [ ] Implement provider state tunggal, mutasi read, device lifecycle, repository typing, outbox/worker, service worker/config, panel, lalu editor reusable.
- [ ] Jalankan regression tests inbox dan producer existing pada setiap perubahan kontrak.

### Refactor dan verifikasi

- [ ] Pertahankan dependency direction hexagonal dan atomic sections; gunakan existing core/utils/libs/shared UI.
- [ ] Semua file sumber dibuat/diubah memiliki `// Files: path/file.tsx` sebelum directive client bila ada.
- [ ] Jalankan `npm run typecheck`, `npm run lint`, `npm run lint:barrel`, `npm run test`, dan `npm run build` sesuai scripts proyek.
- [ ] Uji manual permission denied/granted, foreground/background, dua akun pada browser sama, dua tenant, slow network, refresh, dan worker restart.
- [ ] Pengujian FCM menggunakan perangkat/environment terotorisasi, bukan broadcast produksi.
- [ ] Sajikan diff, migration, hasil verifikasi dan screenshot untuk review sebelum commit; jangan langsung commit/push/merge.

## Acceptance criteria

1. Badge dan panel berbagi satu state, polling dan listener; pesan duplikat tidak menambah count dua kali.
2. Read gagal tidak membuat UI mengklaim mutasi berhasil; tab/page dan response terbaru tetap konsisten.
3. Actor/tenant lama tidak tersisa dalam state atau ownership perangkat setelah transisi sesi berhasil.
4. Inbox tetap berfungsi bila Firebase tidak tersedia atau browser menolak push.
5. Kegagalan push tercatat dan retry terbatas melalui worker persisten, tanpa menggandakan inbox.
6. Config client/service worker konsisten, background push tidak tampil ganda pada skenario yang diuji.
7. Repository bertipe, tenantId null didukung, dan isolasi penerima/tenant lolos regression tests.
8. Panel dapat digunakan pada mobile dan keyboard.
9. Editor reusable SSR-safe, sinkronisasi create/edit/reset benar, serta rendering rich text aman.
10. Pemeriksaan proyek lulus atau blocker lingkungan dilaporkan spesifik; tidak ada klaim delivery/read yang tidak terbukti.

## Di luar scope / follow-up

- Management campaign Admin/Tenant, penjadwalan campaign, audience UI dan laporan lengkap: gunakan issue management notifikasi sebelumnya dan reuse fondasi ini.
- Tombol `Daftarkan Tenant Baru` pada dashboard yang belum terhubung: selesaikan melalui issue dashboard Admin agar perubahan fitur tidak bercampur.

## Deliverables

- Perbaikan source dan regression tests.
- Migration additive, worker dan dokumentasi deployment/rollback.
- Editor/field/viewer Tiptap reusable dan refactor Questions yang kompatibel.
- Bukti pemeriksaan, screenshot mobile/desktop dan catatan keterbatasan.

## Dokumentasi resmi

- https://firebase.google.com/docs/cloud-messaging/send/admin-sdk
- https://firebase.google.com/docs/cloud-messaging/js/receive
- https://tiptap.dev/docs/editor/getting-started/install/nextjs

Periksa API yang tersedia pada lockfile proyek sebelum mengadopsi contoh dokumentasi terbaru.
