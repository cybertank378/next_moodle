# Issue 19 — Performance & Resilience

## Nama Issue

**BFF/Moodle Performance, Timeout, Retry, Cache & Resilience Hardening**

## Tujuan

Mengoptimalkan latency dan load Next.js↔Moodle tanpa mengubah authorization, tenant isolation, ownership, atau Moodle source-of-truth correctness.

## Dependency

- [ ] Issue 18 selesai.

## Scope Pengerjaan

- Hilangkan N+1 Moodle calls.
- Batch operations bila Moodle/custom API mendukung.
- Parallel independent reads secara bounded.
- Bounded timeout.
- Retry hanya untuk operation yang aman/idempotent.
- Metadata cache yang aman.
- Tidak cache mutable active-attempt source of truth secara berbahaya.
- Aggregated monitor endpoint.
- Pagination untuk large tables.
- Request correlation ID.
- Observability latency/error dasar.

## Out of Scope

- Mengubah Moodle menjadi eventually consistent copy di SaaS DB.
- Retry otomatis pada non-idempotent submit tanpa idempotency contract.
- Premature WebSocket migration.
- Caching password/token plaintext.

## Task Checklist

### Baseline & Measurement

- [ ] Identifikasi endpoint/use case dengan call count tertinggi.
- [ ] Catat baseline request count/latency pada dev/test environment yang representatif.
- [ ] Identifikasi N+1 pattern.
- [ ] Identifikasi duplicate requests dari React/client effects.

### Moodle Calls

- [ ] Gunakan batch endpoint jika tersedia.
- [ ] Gunakan aggregated custom endpoint untuk monitoring.
- [ ] Parallelize independent reads dengan concurrency yang dibatasi.
- [ ] Hindari fan-out tak terbatas.
- [ ] Pastikan setiap request memiliki timeout budget.

### Retry Policy

- [ ] Definisikan transient error yang retryable.
- [ ] Retry hanya idempotent-safe operations.
- [ ] Gunakan bounded attempts/backoff.
- [ ] Jangan auto-retry final submit/mutation non-idempotent tanpa contract aman.
- [ ] Preserve request ID/correlation across retry context.

### Cache Policy

- [ ] Tentukan resource metadata yang dapat dicache.
- [ ] Definisikan TTL/invalidation.
- [ ] Tenant menjadi bagian cache key.
- [ ] Actor/permission-sensitive data tidak dicache lintas actor.
- [ ] Active attempt mutable state tidak menggunakan stale shared cache.
- [ ] Credential/token tidak masuk general-purpose cache.

### Pagination & Payload

- [ ] Large admin/tenant tables menggunakan pagination.
- [ ] Avoid over-fetching raw Moodle fields yang tidak dipakai.
- [ ] Batasi page size.
- [ ] Validate sort/filter parameters.

### Resilience & Observability

- [ ] Log latency/error category tanpa secret.
- [ ] Include request ID.
- [ ] Distinguish timeout, upstream error, validation, unauthorized.
- [ ] Pastikan fallback/error state UI tidak menyembunyikan data stale sebagai success.

### Tests

- [ ] Timeout behavior.
- [ ] Retryable transient read retries sesuai policy.
- [ ] Non-idempotent mutation tidak retry otomatis.
- [ ] Cache tenant key isolation.
- [ ] Cache authorization isolation jika applicable.
- [ ] Cache TTL/invalidation.
- [ ] Request deduplication bila digunakan.
- [ ] Monitor no-N+1 regression.
- [ ] Pagination maximum limit.

## TDD Workflow

### RED

- [ ] Tambahkan regression tests untuk timeout/retry/cache/N+1 sebelum optimasi.

### GREEN

- [ ] Implement optimization yang terukur tanpa mengubah semantic behavior.

### REFACTOR

- [ ] Hapus optimization-specific duplication.
- [ ] Keep policy explicit; jangan menyembunyikan retry/cache di tempat yang membuat mutation unsafe.

## Acceptance Criteria

- [ ] Tidak ada known N+1 besar pada critical flows.
- [ ] Timeout policy konsisten.
- [ ] Retry policy tidak menyebabkan duplicate unsafe mutation.
- [ ] Cache tidak melanggar tenant/actor isolation.
- [ ] Active attempt correctness tidak dikorbankan.
- [ ] Pagination tersedia untuk list besar.

## Definition of Done (DoD)

- [ ] Baseline dan hasil optimasi terdokumentasi singkat di issue/PR.
- [ ] N+1 regression tests GREEN.
- [ ] Timeout/retry tests GREEN.
- [ ] Cache isolation tests GREEN.
- [ ] No unsafe retry untuk submit/destructive action.
- [ ] Authorization/tenant isolation regression tetap GREEN.
- [ ] `npm run typecheck` lulus.
- [ ] `npm run lint` lulus.
- [ ] `npm run test` lulus.
- [ ] `npm run build` lulus.
- [ ] Tidak ada barrel export.

## Global Constraints

Checklist berikut berlaku selama pengerjaan issue ini:

- [ ] Mengikuti **TDD RED → GREEN → REFACTOR** untuk behavior yang dapat diuji.
- [ ] TypeScript `strict` tetap aktif dan tidak dimatikan untuk melewati error.
- [ ] Semua error/warning Biome yang terkait perubahan diselesaikan.
- [ ] Tidak ada direct call **browser → Moodle**.
- [ ] Tidak ada direct SQL dari Next.js ke database Moodle.
- [ ] Moodle token, password, credential, secret, atau stack trace tidak masuk response browser maupun log.
- [ ] Route handler tetap tipis: parse request → resolve context → panggil controller/factory → return response.
- [ ] Business rule berada di domain/application, bukan di `route.ts` atau komponen UI.
- [ ] Authorization tidak mengandalkan UI hiding.
- [ ] Tenant isolation diperiksa untuk seluruh operasi tenant-scoped.
- [ ] Ownership diperiksa untuk seluruh resource milik STUDENT.
- [ ] External Moodle response dimapping sebelum masuk ke application/domain.
- [ ] Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) tidak bocor ke presentation/UI.
- [ ] Tidak membuat abstraction/folder kosong hanya untuk memenuhi template.
- [ ] **Dilarang membuat barrel `index.ts` / `index.tsx`; semua import menggunakan concrete file path.**

## Verification

Jalankan seluruh command berikut dan pastikan semuanya lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menambahkan integration/E2E test, jalankan command test tambahan yang relevan sebelum issue ditutup.
