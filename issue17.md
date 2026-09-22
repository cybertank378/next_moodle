# Issue 17 — Exam Monitoring

## Nama Issue

**TENANT Exam Runtime Monitoring & Proctor Administrative Actions**

## Tujuan

Membangun monitor runtime ujian untuk TENANT/proctor dengan data agregat, polling yang efisien, dan administrative actions yang diaudit serta tenant-scoped.

## Dependency

- [ ] Issue 16 selesai.
- [ ] Aggregated monitor/custom Moodle API tersedia/terverifikasi.

## Scope Pengerjaan

Features:

- active participants;
- started/not started/finished;
- last activity/disconnected bila backend tersedia;
- force finish;
- reset attempt;
- extend time;
- force logout;
- audit-ready context untuk semua action.

Page:

```text
/tenant/exams/[quizId]/monitor
```

## Out of Scope

- WebSocket wajib; initial implementation menggunakan polling.
- Browser polling per participant.
- AI cheating/proctor evidence system (separate project/issue jika dibutuhkan).

## Task Checklist

### Domain & Application

- [ ] Definisikan monitor response DTO.
- [ ] Definisikan active attempt/participant status DTO.
- [ ] Definisikan monitor status types.
- [ ] Implement `GetExamMonitorUseCase`.
- [ ] Implement `GetActiveAttemptsUseCase` bila diperlukan terpisah.
- [ ] Implement `ForceFinishAttemptUseCase`.
- [ ] Implement `ResetAttemptUseCase`.
- [ ] Implement `ExtendAttemptTimeUseCase`.
- [ ] Implement `ForceLogoutUserUseCase`.
- [ ] Apply read/action permissions.
- [ ] Validate target belongs to quiz + tenant.

### Infrastructure

- [ ] Gunakan aggregated monitor endpoint dari custom plugin.
- [ ] Jangan query Moodle satu kali per participant.
- [ ] Map participant state ke internal types.
- [ ] Map administrative action result/error.
- [ ] Support request ID untuk audit correlation.

### API

- [ ] Implement ExamMonitorController.
- [ ] Implement `/api/exam-monitor/_factory.ts`.
- [ ] Implement quiz monitor route.
- [ ] Implement force-finish route.
- [ ] Implement reset route.
- [ ] Implement extend-time route.
- [ ] Implement force-logout route.
- [ ] Semua mutation memerlukan `EXAM_MONITOR_ACTION`.

### Presentation/UI

- [ ] Implement `useExamMonitorApi`.
- [ ] Monitor summary/header.
- [ ] Participant status table/grid.
- [ ] Filter status/search participant.
- [ ] Polling dengan interval masuk akal.
- [ ] Pause/slow polling ketika page tidak aktif bila feasible.
- [ ] Indikator last updated.
- [ ] Action confirmation untuk force finish/reset/logout.
- [ ] Extend-time form validation.
- [ ] Skeleton/empty/error state.

### Audit Context

- [ ] Setiap action membawa actorId/tenantId/requestId.
- [ ] Simpan action/result metadata yang aman untuk Issue 18.
- [ ] Jangan simpan token/raw Moodle payload pada audit.

### Tests

- [ ] Monitor read permission.
- [ ] Mutation requires `EXAM_MONITOR_ACTION`.
- [ ] Cross-tenant target rejected.
- [ ] Target not belonging to quiz rejected.
- [ ] Force finish success/failure.
- [ ] Reset success/failure.
- [ ] Extend time validation.
- [ ] Force logout success/failure.
- [ ] Polling uses aggregated endpoint.
- [ ] No N+1 participant request regression.
- [ ] UI action confirmation.

## TDD Workflow

### RED

- [ ] Tulis action authorization dan N+1 regression tests terlebih dahulu.

### GREEN

- [ ] Implement monitor vertical slice menggunakan aggregated endpoint.

### REFACTOR

- [ ] Centralize polling state.
- [ ] Jangan menyimpan server mutable attempt state sebagai authoritative cache di client.
- [ ] Keep action components callback-driven.

## Acceptance Criteria

- [ ] Tenant dapat melihat runtime status exam tenant sendiri.
- [ ] Administrative actions hanya untuk actor dengan permission.
- [ ] Cross-tenant action ditolak.
- [ ] Monitor tidak melakukan polling per participant.
- [ ] Action menyediakan audit-ready context.

## Definition of Done (DoD)

- [ ] Monitor page lengkap.
- [ ] Aggregated polling terimplementasi.
- [ ] Semua administrative actions terimplementasi sesuai custom API capability.
- [ ] RBAC/tenant target tests GREEN.
- [ ] N+1 regression test GREEN.
- [ ] Audit context tersedia.
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
