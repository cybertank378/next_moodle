# AGENTS.md — Panduan Optimalisasi Aksaventra / next_moodle

Panduan ini berlaku untuk seluruh repository. Baca juga `AGENTS.md` yang lebih spesifik jika kelak ditambahkan. Instruksi pengguna untuk tugas yang sedang dikerjakan tetap menjadi acuan utama. Jangan mengubah perilaku ujian, RBAC, isolasi tenant, atau kontrak API hanya untuk mengejar metrik performa.

Issue pelaksanaan: [#151](https://github.com/cybertank378/next_moodle/issues/151). Dokumen ini menetapkan aturan kerja; penambahannya belum berarti seluruh optimasi telah diimplementasikan.

## Konteks dan batas arsitektur

- Acuan awal: branch `development`, commit `45b7382dcf30136563ec32b4e0100b81b2ceea1b` (7 Oktober 2026). Periksa kembali versi dan struktur sebelum setiap implementasi.
- `package.json` mendeklarasikan Next.js `^16.3.5`, React `^19.3.0`, TypeScript, Tailwind CSS v4, Prisma v7 dengan `@prisma/adapter-pg`, Biome, dan Vitest. Gunakan versi yang benar-benar terselesaikan di lockfile; jangan mengganti versi dalam tugas optimasi tanpa alasan terukur.
- Pertahankan Hexagonal / DDD: domain berisi aturan dan kontrak; application berisi use case; infrastructure menangani Prisma, Moodle, HTTP, cache, limiter, dan worker; presentation menyediakan hook client. Next.js cache API dan dependensi UI tidak masuk ke domain/application.
- `src/app/**/page.tsx` tetap menjadi entry tipis untuk metadata dan pemanggilan section. Pengambilan data awal berada pada Server Component di `src/sections/{feature}/pages/` atau organisme server, melalui loader `server-only` pada modul terkait. Route Handler menjadi adapter HTTP untuk browser, integrasi eksternal, dan webhook.
- Gunakan struktur `src/sections/{feature}/{atoms,molecules,organisms,pages}`. Organisms menyusun molecules; molecules menyusun atoms. Atoms/molecules menerima props dan callback. Gunakan ulang shared UI di `src/shared-ui/component` dan API hook yang sudah ada untuk interaksi client.
- Jangan membuat barrel export `index.ts`/`index.tsx`. Gunakan impor langsung. Ikuti panduan [arsitektur](01_Bootstrap_Architecture_Guardrails.md), [sections](21_sections_pattern_design.md), [tema](22_styling_with_theme.md), dan [TDD](docs/tdd-guidelines.md).
- Pertahankan tema gelap/terang, layout responsif, key dari identitas data, dan aset yang berguna pada empty state. Gunakan Button, field, Skeleton, EmptyState, Modal, Pagination, serta toast yang tersedia; jangan memakai `alert()` untuk feedback.

## 1. Cache dan kebaruan data

### 1.1 Data per pengguna selalu dibaca tanpa cache persisten

- Untuk browser, baca data pengguna melalui Route Handler terautentikasi dengan `fetch(..., { cache: "no-store", credentials: "include" })`. Respons pribadi wajib memiliki `Cache-Control: private, no-store`; pastikan CDN/reverse proxy menghormatinya, termasuk pada respons error pribadi.
- Untuk Server Component, panggil loader/use case server secara langsung setelah sesi, permission, dan tenant divalidasi. Jangan melakukan HTTP fetch ke `/api` milik aplikasi sendiri. Pembacaan upstream yang bergantung pengguna harus eksplisit `cache: "no-store"` dan tidak dibungkus cache persisten.
- Larang cache persisten untuk sesi, token, hasil otorisasi, dashboard pribadi, nilai, jawaban, attempt, enrollment pengguna, dan notifikasi pribadi. Jangan memakai `force-cache`, `unstable_cache`, `use cache`, atau Moodle TTL cache untuk hasil tersebut. Deduplikasi React yang terbatas satu request tetap diperbolehkan.
- Terapkan aturan pada semua lapisan: Next Data Cache, Full Route Cache, adapter Moodle, cache browser/client, dan reverse proxy. `no-store` pada fetch saja tidak mematikan cache adapter buatan sendiri.

### 1.2 Hierarki kebaruan wajib dinyatakan

| Kategori | Kebijakan awal | Contoh dan batas |
| --- | --- | --- |
| Konten publik/statis yang aman dibagikan | Revalidasi 3.600 detik | Informasi produk dan referensi publik; aset ber-hash boleh immutable |
| Katalog yang aman dibagikan dalam satu tenant | Revalidasi 120 detik; perubahan TTL harus dijelaskan | Metadata kategori/kursus tanpa filter enrollment atau permission pengguna |
| Data pribadi, keamanan, atau transaksi | Tanpa cache persisten; `no-store` | Sesi, nilai, jawaban, status attempt, akses ujian, monitor, enrollment pribadi |

- TTL revalidasi bukan jaminan batas usia yang mutlak: revalidasi dapat berlangsung pada request berikutnya dan beberapa mekanisme menyajikan data lama sementara pembaruan berjalan. Gunakan pembacaan langsung jika batas usia bersifat wajib.
- Validasi kembali sesi, permission, tenant, akses, dan status terbaru saat start/save/submit/lock/unlock/extend-time atau mutasi lain. Data UI dan snapshot cache tidak boleh menjadi dasar tunggal keputusan.
- Cache key/tag katalog wajib memuat tenant, identitas sumber Moodle, resource, parameter terkanonisasi, serta versi konteks layanan jika hasil bergantung padanya. Jangan menyertakan token mentah. Data yang tetap bergantung pengguna dikategorikan sebagai pribadi, bukan katalog.
- `core_webservice_get_site_info` dapat membawa identitas pengguna/capability. Jangan menganggap seluruh responsnya statis; cache hanya metadata yang sudah dipisahkan dan aman dibagikan. Perubahan sumber Moodle/credential harus menghapus entri yang terkait.

### 1.3 Invalidasi server dan penyegaran client adalah dua kewajiban berbeda

- Setiap mutasi sukses harus menyatakan data/cache/view yang terdampak. Setelah commit database atau konfirmasi sukses Moodle, invalidasi seluruh cache yang relevan; jangan invalidasi lebih dahulu.
- Untuk cache Next gunakan `revalidatePath` dan/atau tag yang sudah didaftarkan. `revalidateTag(tag, "max")` sesuai untuk katalog yang mengizinkan stale-while-revalidate. Jika Route Handler memerlukan kedaluwarsa langsung gunakan `revalidateTag(tag, { expire: 0 })`; `updateTag(tag)` hanya boleh digunakan dari Server Action.
- Jika adapter Moodle/Redis ikut menyimpan data, invalidasi adapter itu secara eksplisit. `revalidateTag` tidak otomatis menghapus Map atau Redis milik aplikasi.
- Setelah mutasi client, panggil `router.refresh()` untuk view yang bersumber dari Server Components. Untuk view yang memakai hook/cache client, refetch atau invalidasi key client juga. `router.refresh()` tidak menginvalidasi cache server dan tidak otomatis memuat ulang state pada hook client.
- Untuk data yang memang tidak pernah di-cache, nyatakan hal tersebut dan refresh/refetch view yang terdampak. Bila invalidasi gagal setelah mutasi berhasil, jangan mengulang mutasi secara buta; catat dan tangani invalidasinya agar tidak menimbulkan operasi ganda.

### 1.4 Segarkan data sensitif ketika fokus kembali

- Gunakan satu mekanisme focus/`visibilitychange` yang dibatasi pada layar sensitif dan hanya berjalan ketika halaman terlihat. Bersihkan listener, throttle, dedupe request yang berjalan, dan tangani kondisi offline.
- Refresh Server Components dengan `router.refresh()`; refetch hook client yang menjadi sumber data layar. Cegah reset draft jawaban, autosave, dan timer ujian saat refresh.
- `experimental.staleTimes` mengatur Router Cache client dan bersifat eksperimental. Jangan mengaktifkan/memperpanjangnya secara global tanpa uji versi, navigasi back/forward, logout, ganti akun/tenant, dan stale data. Opsi tersebut tidak menggantikan invalidasi server atau validasi aksi.
- Jika SWR/TanStack Query kelak dipakai, `staleTime`/revalidate-on-focus adalah kebijakan cache client yang berbeda. Isolasi key menurut pengguna/tenant dan kosongkan data pribadi ketika logout atau scope berubah.

### 1.5 Batasi pembacaan cookie dan data request

- Gunakan kembali resolver sesi di `src/modules/auth/server/`; tempatkan pembacaan `cookies()`/`headers()` pada komponen/loader server sekecil mungkin, dengan `<Suspense>` dan fallback yang sesuai jika mendukung streaming.
- Jangan mengirim sesi lengkap, token Moodle, cookie, atau credential sebagai props ke Client Component. Kirim DTO minimum.
- Pada baseline ini `cacheComponents` belum aktif. Membaca cookie tetap membuat route dinamis; `<Suspense>` saja tidak mempertahankan HTML statis di Full Route Cache. Keuntungan static shell dengan personalisasi memerlukan evaluasi dan migrasi Cache Components/PPR tersendiri.
- Jika Cache Components diaktifkan, ikuti API versi terpasang seperti `use cache`, `cacheLife`, dan `cacheTag` untuk data yang aman. Jangan mencampurkan konfigurasi segment lama yang tidak kompatibel. Pertahankan pemeriksaan akses protected layout dan loader; optimasi cookie tidak boleh membuka konten terlindungi.

## 2. useEffect dan pengambilan data

### 2.1 Data awal berasal dari Server Component

- Muat data awal melalui server section/loader dan teruskan DTO atau promise ke batas UI yang membutuhkan. Hindari pola halaman kosong -> mount -> `useEffect` -> fetch untuk data yang tersedia di server.
- `useEffect` digunakan untuk sinkronisasi setelah render: listener, koneksi/subscription, integrasi browser, focus refresh, dan polling yang diperlukan. Mutasi dari tindakan pengguna ditempatkan pada event handler.
- Seed hook client dari data server jika hook tetap diperlukan. Hindari fetch awal ganda dan pastikan props baru hasil refresh dapat memperbarui state yang relevan tanpa menghapus draft pengguna.

### 2.2 Mulai pekerjaan independen secara paralel dan stream per bagian

- Setelah otorisasi yang diperlukan selesai, mulai promise independen di level server teratas yang memiliki konteks tersebut. Gunakan `Promise.all` untuk satu unit yang harus berhasil bersama, atau hasil per bagian/`Promise.allSettled` untuk widget independen.
- Hanya serialkan dependensi nyata, misalnya daftar kursus sebelum daftar kuisnya. `<Suspense>` adalah batas streaming/loading; dependensi data tetap harus dinyatakan di kode.
- Jangan menunggu seluruh promise di parent sebelum mengembalikan seluruh batas `<Suspense>` jika tujuannya streaming. Batasi concurrency untuk fan-out ke banyak kursus/tenant agar pool dan Moodle tidak kewalahan.

### 2.3 Gunakan satu logika server untuk UI dan HTTP

- Ekstrak fungsi loader server dan composition root dari wiring yang khusus HTTP bila diperlukan. Server Component dan Route Handler memanggil use case yang sama melalui adapter masing-masing.
- Pertahankan `Result`, DTO, validasi, RBAC, dan tenant scope. Panggilan langsung dari server tetap wajib melakukan otorisasi, termasuk aturan yang sebelumnya berada di controller.
- Jangan menduplikasi query, membuat `Request` palsu untuk memanggil controller, atau memindahkan aturan bisnis ke UI. Fungsi server yang dibagi wajib `server-only` jika mengakses credential/infrastructure.

### 2.4 Tangani kegagalan per bagian

- Periksa `response.ok`, kegagalan envelope API, dan exception Moodle pada HTTP 200. Beri timeout, error yang aman, serta retry terbatas hanya untuk operasi yang memang aman diulang.
- Berikan fallback/loading/error/retry untuk widget opsional; halaman lain tetap dapat digunakan. Bedakan data kosong, gagal dimuat, dan data lama. Jangan membuat nilai/nilai ujian palsu agar tampilan terlihat lengkap.
- Auth, tenant scope, dan validasi transaksi harus gagal tertutup. Jangan mengubah kegagalan otorisasi menjadi sukses dengan data kosong. Biarkan `redirect()`/`notFound()` dan error kontrol Next mencapai boundary yang tepat.

### 2.5 Pahami lingkup deduplikasi

- Fetch GET/HEAD identik dapat dideduplikasi selama render React yang sama; ini bukan cache persisten lintas request. Route Handler, POST Moodle, dan query Prisma tidak otomatis mendapat deduplikasi tersebut.
- Untuk query langsung gunakan React `cache()` hanya untuk dedupe satu request bila sesuai. Cache lintas request hanya untuk kategori yang diizinkan dalam bagian 1, dengan TTL, key, dan invalidasi.
- Pertahankan hook client yang ada. SWR/TanStack Query belum menjadi dependency pada baseline; jangan memasang keduanya atau menambah library hanya untuk mengganti nama pola fetching. Jika dipilih, jelaskan kebutuhan dan ukuran tambahannya.

## 3. Memori, bundle, dan state

### 3.1 Ukur bundle pada setiap rilis

- Rekam hasil analisis build production, chunk per route, gzip/Brotli transfer, dependency berat, waktu build, peak heap/RSS, serta baseline sebelum/sesudah perubahan. Cocokkan analyzer dengan bundler/versi Next yang digunakan.
- Hapus dependency yang benar-benar tidak dipakai setelah memeriksa impor, dynamic import, konfigurasi, script, dan test. Perbarui lockfile dan jalankan pemeriksaan. Jangan menghapus library hanya berdasarkan satu pencarian.
- Catat budget per route untuk initial JS, gambar, serta HTML/RSC setelah baseline diukur; regresi lebih dari 10% memerlukan penjelasan dan review. Pisahkan bundle rute siswa dari editor Tiptap/KaTeX, kalender, chart, atau fitur admin yang tidak diperlukan.

### 3.2 Tinjau luas batas `use client`

- Catat file client yang berubah dan dampaknya pada impor/chunk. Jumlah directive adalah indikator review, bukan pengganti pengukuran ukuran bundle.
- Tempatkan interaksi pada komponen daun atau pulau interaksi terkecil; parent/section presentasional tetap server bila memungkinkan. Gunakan komposisi/children untuk melewatkan UI server melalui shell client.
- Lazy-load editor, kalender, chart, dan modal berat saat diperlukan. `ssr: false` hanya dari Client Component yang tepat; jangan mematikan SSR seluruh halaman demi satu widget.

### 3.3 Batasi pekerjaan dan cache server

- Terapkan parallel fetch dan `<Suspense>` sesuai bagian 2.2. Gunakan pagination, batas batch, payload DTO minimum, serta concurrency terukur; jangan memakai `Promise.all` tanpa batas untuk seluruh dataset.
- Setiap Map/cache/limiter in-memory wajib memiliki TTL, batas jumlah entri atau byte, serta eviction/sweep yang benar-benar menghapus entri kedaluwarsa meskipun key tidak dibaca lagi.
- Singleton boleh menyimpan resource infrastructure, tetapi tidak actor/token/data request sebagai state global. Untuk beberapa instance, cache/limiter yang memerlukan konsistensi lintas instance harus memakai backend bersama dengan TTL dan operasi atomik.

### 3.4 Optimalkan media dan payload halaman

- Gunakan `next/image` untuk raster yang cocok, dengan `width`/`height` atau `fill`+`sizes`, dimensi stabil, aspect ratio benar, dan `alt` yang tepat. SVG/icon, video/audio, CSS background, serta media terautentikasi memakai pipeline yang sesuai; jangan memaksanya menjadi Image.
- Kompresi/sizing aset dilakukan sebelum upload. Gunakan WebP/AVIF berdasarkan pengukuran, lazy loading untuk media di bawah viewport, dan preload/eager hanya bagi gambar penting sesuai API versi Next.
- Media pribadi tidak boleh masuk optimizer/cache publik atau mengekspos token Moodle pada URL browser. Gunakan delivery terautentikasi atau layanan gambar yang aman.

### 3.5 Letakkan state di dekat pemakai dan ukur render

- Colocate state; pisahkan context berdasarkan tanggung jawab dan frekuensi perubahan. Jangan menyimpan salinan dataset besar di banyak context atau state turunan yang bisa dihitung.
- Gunakan React Profiler untuk menentukan sumber re-render. Pakai memoisasi/stabilisasi prop hanya ketika bermanfaat terukur.
- Bersihkan timer, event listener, AbortController, subscription, dan object URL pada lifecycle yang tepat. Batalkan/abaikan hasil request lama agar tidak menimpa filter atau tenant baru.

## 4. Rendering, database, gambar, dan beban endpoint

### 4.1 Gunakan static rendering/ISR untuk konten yang aman

- Konten publik yang tidak bergantung cookie/pengguna dapat menggunakan static rendering dan ISR. Query sumber untuk bagian statis dijalankan pada build/cache miss/revalidasi, bukan setiap hit HTML yang tersimpan.
- Verifikasi output `next build` dan perilaku `next start`; jangan mengklaim suatu route statis berdasarkan keberadaan `revalidate` saja. Data pribadi dan keputusan akses tetap request-time.

### 4.2 Nyatakan kebijakan cache secara eksplisit

- Pada model baseline tanpa Cache Components, fetch tidak otomatis tersimpan di Data Cache. Untuk data aman gunakan `next: { revalidate: 3600 }`/`120` atau cache query yang sesuai, dengan tag yang terisolasi.
- Gunakan `no-store` untuk data pribadi/keamanan/transaksi serta data realtime, walaupun frekuensi perubahannya rendah. Jangan mengaktifkan `force-cache` secara global.
- Jangan menggabungkan `cache: "no-store"` dengan `next.revalidate` positif pada fetch yang sama. Sesuaikan konfigurasi bila model Cache Components berubah; jangan sekadar menyalin contoh dokumentasi versi lain.

### 4.3 Gunakan singleton Prisma dan pool yang sudah ada

- Gunakan `src/libs/prisma.ts`; jangan membuat PrismaClient atau `pg.Pool` baru pada setiap request. Pertahankan state `globalThis` yang aman terhadap hot reload.
- Proyek memakai Prisma v7 + adapter `pg`: batas pool ditetapkan melalui `pg.Pool.max`/`PG_POOL_MAX`, bukan mengandalkan parameter URL Prisma v6 `connection_limit`.
- Validasi konfigurasi `PG_POOL_MAX`, `PG_IDLE_TIMEOUT_MS`, dan `PG_CONN_TIMEOUT_MS`. Anggarkan jumlah seluruh pool aplikasi dan worker terhadap kapasitas database dengan cadangan administrasi; bukan limit per instance saja.
- Jangan `$disconnect()` atau menutup shared pool setelah setiap HTTP request. Cleanup dilakukan saat shutdown atau proses CLI terisolasi. Gunakan select/pagination/batching untuk mencegah payload berlebih dan N+1.

### 4.4 Batasi konfigurasi Image berdasarkan kebutuhan

- Ganti `remotePatterns` hostname `"**"` dengan allowlist hostname/path/protocol yang tervalidasi. Untuk Moodle multi-tenant, gunakan registry atau media gateway terkontrol; jangan membuka wildcard seluruh internet. `http://localhost` hanya untuk development yang memerlukannya.
- Tentukan `deviceSizes`, `imageSizes`, dan allowlist kualitas berdasarkan layout serta perangkat yang didukung; pertahankan kecukupan resolusi desktop/mobile.
- Naikkan `minimumCacheTTL` untuk media publik stabil yang memakai URL ber-versi/hash setelah pengukuran. Image cache tidak dihapus oleh `revalidateTag`; pergantian media harus mengganti identitas URL. Jangan memakai TTL panjang untuk media sensitif atau sering berubah.

### 4.5 Lindungi endpoint berat dan pindahkan job panjang ke queue

- Terapkan coarse rate limiting pada `src/proxy.ts` dengan matcher yang spesifik jika layer ini ditambahkan. Pertahankan limiter/auth/RBAC/tenant validation pada Route Handler/use case; proxy tidak menjadi satu-satunya pengaman.
- Gunakan backend limiter bersama yang atomik pada deployment beberapa instance. Key terautentikasi menggunakan tenant+actor+scope; IP hanya dari reverse proxy tepercaya untuk batas anonim/luar. Jangan memblokir seluruh sekolah hanya karena berbagi IP atau mempercayai header IP dari client.
- Pilih ambang berbeda untuk login, import/export, notifikasi, monitoring, dan start/save/submit attempt. Respons limit memakai 429 dan `Retry-After`; rate limit tidak boleh menghilangkan jawaban atau mematahkan autosave yang sah.
- Pekerjaan import/export besar dan pengiriman massal berjalan melalui queue/outbox durable + worker. Gunakan kembali outbox dan `NotificationOutboxWorker` yang tersedia; audit klaim atomik/lease, idempotensi, concurrency, timeout, retry/backoff, dan status hasil.
- Respons pekerjaan asinkron memakai 202 + job ID/status endpoint dengan akses tenant/actor yang sama. `setTimeout`, fire-and-forget, atau `after()` bukan pengganti antrean durable. Operasi save/submit ujian tetap memberikan hasil persistensi yang benar sebelum dinyatakan sukses.

## Alur kerja dan verifikasi

1. Baca kode dan instruksi pada branch tujuan, petakan data menurut scope/TTL, lalu ambil baseline production sebelum mengubah perilaku.
2. Untuk perilaku baru/bug, ikuti TDD: tulis skenario meaningful, lihat gagal, implementasikan, lalu refactor. Fokus pada isolasi pengguna/tenant, invalidasi setelah commit, perubahan sesi, partial failure, batas cache/limiter, dan concurrency job.
3. Kerjakan perubahan bertahap per modul. Pertahankan DTO/API dan shell UI, dan tulis strategi rollback untuk perubahan cache, pool, limiter, atau worker.
4. Untuk perubahan kode jalankan `npm run typecheck`, `npm run lint`, `npm run lint:barrel`, `npm run test` (atau `npm run verify`), serta `npm run build` bila berdampak pada rendering/bundling/config. Jalankan `npm run env:check` bila konfigurasi env berubah dengan env pengujian yang sesuai.
5. Uji cache/ISR dan fokus/navigasi pada mode production (`build` + `start`), dua akun dalam tenant yang sama dan dua tenant, logout/ganti akun, serta mutasi sukses/gagal. Pastikan nilai/jawaban/draft ujian tidak rusak oleh refresh.
6. Lampirkan bukti bundle/network/profiler, p50/p95 latency, request/query count, heap/RSS dan pool bila relevan. Catat environment, commit, cold/warm cache, beban, serta keterbatasan pengukuran. Jangan mengklaim angka perbaikan tanpa data.
7. Untuk perubahan dokumentasi saja, cukup periksa isi, tautan/path, numbering, dan diff; jangan membuat test yang meniru teks panduan. Laporkan pemeriksaan yang dilakukan dan yang belum dilakukan secara jujur.
8. Jangan menjalankan `reset-db`, migration reset, atau script destruktif pada data pengguna untuk validasi optimasi. PR panduan tidak menutup issue pelaksanaan; hanya implementasi dan bukti acceptance criteria yang menyelesaikannya.

## Referensi teknis resmi

- [Caching tanpa Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components)
- [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag), [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes)
- [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data) dan [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Image](https://nextjs.org/docs/app/api-reference/components/image), [Memory usage](https://nextjs.org/docs/app/guides/memory-usage), dan [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Connection pool Prisma v7](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections/connection-pool)
