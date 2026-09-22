# Issue 01 — Bootstrap & Architecture Guardrails

## Nama Issue

**Bootstrap Next.js Exam SaaS & Architecture Guardrails**

## Tujuan

Menyiapkan fondasi project sebelum feature code dibuat, sehingga seluruh issue berikutnya bekerja pada struktur, tooling, dependency direction, dan quality gate yang sama.

## Dependency

- Tidak ada.
- Issue ini adalah prerequisite untuk seluruh issue berikutnya.

## Scope Pengerjaan

- Next.js App Router.
- TypeScript `strict`.
- Tailwind CSS dan shadcn/ui primitives.
- Biome.
- Vitest.
- Prisma 7 + PostgreSQL bootstrap untuk **metadata SaaS saja**.
- Path alias `@/*`.
- Struktur root `core`, `modules`, `sections`, `shared-ui`, `components/ui`.
- Route group `(auth)`, `(admin)`, `(tenant)`, `(student)`.
- Script quality gate.
- Architecture guard untuk no-barrel dan larangan client→Moodle.

## Out of Scope

- Implementasi business module.
- Model akademik Moodle di Prisma.
- Authentication sebenarnya.
- RBAC implementation.
- Integrasi Moodle REST sebenarnya.

## Target Struktur / Deliverables

```text
src/
├── app/
│   ├── (auth)/
│   ├── (admin)/
│   ├── (tenant)/
│   ├── (student)/
│   └── api/
├── components/ui/
├── core/
├── modules/
├── sections/
└── shared-ui/

prisma/
├── schema.prisma
└── migrations/
```

## Task Checklist

### Project & Tooling

- [x] Pastikan project menggunakan Next.js App Router.
- [x] Aktifkan TypeScript `strict` tanpa `skip` untuk error aplikasi.
- [x] Konfigurasi Tailwind CSS.
- [x] Konfigurasi shadcn/ui.
- [x] Konfigurasi Biome sebagai formatter/linter utama.
- [x] Konfigurasi Vitest untuk unit test TypeScript/React.
- [x] Konfigurasi alias `@/*` menuju `src/*`.
- [x] Konfigurasi Prisma 7 dan PostgreSQL connection.
- [x] Buat `.env.example` tanpa secret nyata.

### Repository Structure

- [x] Buat `src/core`.
- [x] Buat `src/modules`.
- [x] Buat `src/sections`.
- [x] Buat `src/shared-ui`.
- [x] Buat `src/components/ui`.
- [x] Buat route group `(auth)`.
- [x] Buat route group `(admin)`.
- [x] Buat route group `(tenant)`.
- [x] Buat route group `(student)`.
- [x] Jangan membuat subfolder kosong yang belum diperlukan.

### Scripts & Quality Gate

- [x] Tambahkan script `typecheck`.
- [x] Tambahkan script `lint`.
- [x] Tambahkan script `lint:fix`.
- [x] Tambahkan script `test`.
- [x] Tambahkan script `test:watch`.
- [x] Tambahkan script `verify`.
- [x] Pastikan `npm run build` menjadi release prerequisite.

Target script minimal:

```json
{
  "typecheck": "tsc --noEmit",
  "lint": "biome check .",
  "lint:fix": "biome check --write .",
  "test": "vitest run",
  "test:watch": "vitest",
  "verify": "npm run typecheck && npm run lint && npm run test"
}
```

### Architecture Guardrails

- [x] Buat test/script yang mendeteksi barrel `src/**/index.ts`.
- [x] Buat test/script yang mendeteksi barrel `src/**/index.tsx`.
- [x] Pastikan file `index.ts` yang hanya entrypoint framework tidak digunakan sebagai re-export barrel feature.
- [x] Tambahkan guard agar `MoodleRestClient` tidak bisa di-import oleh client component.
- [x] Tambahkan guard agar `sections/*` tidak memanggil Moodle URL/function secara langsung.
- [x] Tambahkan dokumentasi import menggunakan concrete file path.

## TDD Workflow

### RED

- [x] Tulis architecture test yang gagal saat barrel file contoh dibuat.
- [x] Tulis architecture test yang gagal saat client component mengimpor Moodle adapter.
- [x] Tulis architecture test yang gagal saat UI memanggil endpoint Moodle langsung.

### GREEN

- [x] Implement architecture checks sampai seluruh test di atas lulus.
- [x] Implement konfigurasi project minimum agar typecheck, lint, test, dan build dapat dijalankan.

### REFACTOR

- [x] Hapus placeholder/abstraction yang tidak diperlukan.
- [x] Rapikan alias/import tanpa membuat barrel.
- [x] Pastikan config tidak menduplikasi responsibility.

## Acceptance Criteria

- [x] Project dapat dijalankan pada development mode.
- [x] Project dapat di-build tanpa error.
- [x] Test runner berjalan.
- [x] TypeScript strict aktif.
- [x] Biome aktif.
- [x] Prisma 7 dapat generate client.
- [x] Route group Admin/Tenant/Student/Auth tersedia.
- [x] No-barrel architecture guard aktif.
- [x] Tidak ada model course/quiz/question/attempt/answer/grade Moodle di Prisma.

## Definition of Done (DoD)

- [x] Seluruh task dalam Scope Pengerjaan selesai.
- [x] Seluruh RED test sudah pernah gagal karena behavior belum ada.
- [x] Seluruh test sudah GREEN.
- [x] Struktur repository sesuai planning.
- [x] `.env.example` tersedia dan tidak mengandung credential nyata.
- [x] `npm run typecheck` lulus.
- [x] `npm run lint` lulus.
- [x] `npm run test` lulus.
- [x] `npm run build` lulus.
- [x] Tidak ada barrel `index.ts/index.tsx` yang ditambahkan.
- [x] Tidak ada academic data Moodle di SaaS database.

## Global Constraints

Checklist berikut berlaku selama pengerjaan issue ini:

- [x] Mengikuti **TDD RED → GREEN → REFACTOR** untuk behavior yang dapat diuji.
- [x] TypeScript `strict` tetap aktif dan tidak dimatikan untuk melewati error.
- [x] Semua error/warning Biome yang terkait perubahan diselesaikan.
- [x] Tidak ada direct call **browser → Moodle**.
- [x] Tidak ada direct SQL dari Next.js ke database Moodle.
- [x] Moodle token, password, credential, secret, atau stack trace tidak masuk response browser maupun log.
- [x] Route handler tetap tipis: parse request → resolve context → panggil controller/factory → return response.
- [x] Business rule berada di domain/application, bukan di `route.ts` atau komponen UI.
- [x] Authorization tidak mengandalkan UI hiding.
- [x] Tenant isolation diperiksa untuk seluruh operasi tenant-scoped.
- [x] Ownership diperiksa untuk seluruh resource milik STUDENT.
- [x] External Moodle response dimapping sebelum masuk ke application/domain.
- [x] Nama fungsi Moodle (`core_*`, `mod_quiz_*`, `local_examapi_*`) tidak bocor ke presentation/UI.
- [x] Tidak membuat abstraction/folder kosong hanya untuk memenuhi template.
- [x] **Dilarang membuat barrel `index.ts` / `index.tsx`; semua import menggunakan concrete file path.**

## Verification

Jalankan seluruh command berikut dan pastikan semuanya lulus:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

Jika issue menambahkan integration/E2E test, jalankan command test tambahan yang relevan sebelum issue ditutup.
