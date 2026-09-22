# Issue 12 — Student Exam UI

## Nama Issue

**STUDENT Exam Experience — Question UI, Navigation, Autosave, Offline State & Submission**

## Tujuan

Membangun pengalaman ujian STUDENT di atas module `quiz-attempts` dengan state yang jelas, autosave yang dapat diamati, navigasi soal, summary, dan submission flow yang aman.

## Dependency

- [ ] Issue 11 selesai.

## Scope Pengerjaan

Page:

```text
/student/exams/[quizId]/attempt/[attemptId]
```

Required UI states:

```text
loading
ready
saving
saved
retrying
offline
submitting
submitted
error
```

Sections pattern:

```text
src/sections/quiz-attempts/
├── atoms/
├── molecules/
├── organisms/
└── pages/
```

## Out of Scope

- Implementasi attempt business logic baru di component.
- Direct Moodle request dari browser.
- Proctor monitoring.
- Generic spinner-only loading untuk main exam.

## Task Checklist

### Atoms

- [ ] Answer status badge.
- [ ] Attempt timer display.
- [ ] Connection indicator.
- [ ] Question number/status badge.
- [ ] UI atoms hanya menerima props.

### Molecules

- [ ] Answer option/input renderer sesuai supported question type.
- [ ] Attempt header.
- [ ] Question card.
- [ ] Question navigator item.
- [ ] Submit confirmation dialog.
- [ ] Molecules tidak memanggil API.

### Organisms

- [ ] `QuizAttemptView` sebagai state coordinator utama.
- [ ] Question panel.
- [ ] Navigator.
- [ ] Submission panel.
- [ ] API hanya dipanggil melalui `useQuizAttemptApi`/organism.

### Exam State

- [ ] Loading skeleton untuk main exam.
- [ ] Ready state.
- [ ] Saving indicator.
- [ ] Saved indicator.
- [ ] Retry state.
- [ ] Offline state.
- [ ] Submitting state.
- [ ] Submitted state.
- [ ] Fatal/recoverable error state.

### Navigation

- [ ] Previous question.
- [ ] Next question.
- [ ] Direct navigator selection.
- [ ] Answered indicator.
- [ ] Current question indicator.
- [ ] Flagged indicator hanya jika backend/domain mendukung.
- [ ] Preserve unsaved UI state secara aman saat navigation.

### Autosave

- [ ] Trigger save sesuai strategy yang ditentukan.
- [ ] Prevent unnecessary duplicate request bila memungkinkan.
- [ ] Tampilkan saving/saved/error/retry state.
- [ ] Jangan menganggap UI state authoritative sebelum backend response.
- [ ] Handle network disconnect/reconnect.

### Submission

- [ ] Load attempt summary.
- [ ] Tampilkan answered/unanswered summary.
- [ ] Confirmation sebelum submit final.
- [ ] Disable duplicate submit saat request in-flight.
- [ ] Handle already-submitted response secara idempotent-friendly.
- [ ] Redirect/show result state setelah submit sesuai policy.

### Security

- [ ] Verify page attempt belongs to current actor melalui backend.
- [ ] Jangan memasukkan raw token di JS state.
- [ ] Jangan percaya quizId/attemptId untuk ownership tanpa API validation.

### Tests

- [ ] Answer selection.
- [ ] Autosave status transition.
- [ ] Navigator state.
- [ ] Previous/next.
- [ ] Submit confirmation.
- [ ] Submit disabled while submitting.
- [ ] Offline transition.
- [ ] Transient save error + retry.
- [ ] Attempt ownership mismatch.
- [ ] Loading skeleton.
- [ ] Main exam tidak spinner-only.

## TDD Workflow

### RED

- [ ] Tulis component/interaction tests untuk state transition utama.

### GREEN

- [ ] Implement sections atom→molecule→organism→page sampai tests lulus.

### REFACTOR

- [ ] Pastikan state orchestration tidak tersebar di atoms/molecules.
- [ ] Extract pure helpers bila benar-benar reusable.
- [ ] Hindari API call ganda akibat effect/dependency yang tidak stabil.

## Acceptance Criteria

- [ ] Student dapat mengerjakan attempt end-to-end melalui BFF.
- [ ] Autosave state jelas bagi user.
- [ ] Offline/transient failure tidak menghilangkan konteks UI secara tiba-tiba.
- [ ] Main exam menggunakan skeleton/structured loading.
- [ ] Moodle tetap authoritative source untuk saved answer/attempt state.
- [ ] Token Moodle tidak pernah tersedia pada client.

## Definition of Done (DoD)

- [ ] Semua required UI states diimplementasikan.
- [ ] Navigation dan autosave teruji.
- [ ] Submission flow teruji.
- [ ] Ownership negative test GREEN.
- [ ] Atoms/molecules bebas API call.
- [ ] Organism/hook menjadi satu-satunya client data orchestration path.
- [ ] Accessibility dasar form/button/navigation diperiksa.
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
