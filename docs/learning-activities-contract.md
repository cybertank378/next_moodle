# Learning Activities Architecture & Moodle WS Contract (#204)

## 1. Overview
Implementasi pembuatan aktivitas pembelajaran (**Kuis & Evaluasi**, **Materi Pembelajaran**, dan **Tugas Mandiri**) berbasis **Bank Soal Moodle** pada alur:
```text
/dashboard/exams/create?courseId={courseId}
```

## 2. Architectural Design & Standards Compliance
1. **Application Use Case Pattern**:
   - Menerapkan standard `Result<T, Error>` pattern (dari `@/core/base/Result`).
   - Menerima structured Input DTO yang membawa `AuthorizationActor`, `courseId`/`quizId`, `tenantId`, dan optional client.
   - Melakukan validasi izin operasional melalui `ExamAuthorizationService` dan `QuestionAuthorizationService`.
   - Melakukan validasi boundary parameter (misal: ID positif, bobot nilai > 0, jumlah soal acak >= 1).
   - Menghindari 1-line pass-through murni; use case memegang kontrol logika bisnis dan boundary enforcement.

2. **Atomic UI Structure (`src/sections/exam/`)**:
   - **Molecules**:
     - `ActivityTypeSelector.tsx`: Selector 3 jenis aktivitas (Kuis, Materi, Tugas) dengan icon dan deskripsi.
     - `BankSoalQuestionRow.tsx`: Komponen baris butir soal dengan badge tipe soal (`multichoice`, `truefalse`, `shortanswer`, `essay`, `match`, `numerical`) dan bobot poin.
     - `BankSoalPicker.tsx`: Komponen filter kategori, pencarian, pemilihan checkbox butir soal, dan tombol aksi.
     - `AddRandomQuestionsModal.tsx`: Modal konfigurasi penambahan butir soal acak dari kategori tertentu.
     - `ActivityConfigForm.tsx`: Form dinamis sesuai jenis aktivitas (Kuis: target quiz, durasi, KKM; Materi: konten modul; Tugas: batas waktu, skor max).
   - **Organisms**:
     - `CreateActivityOrganism.tsx`: Mengorkestrasi state form, pemanggilan hook API (`useQuestionApi`, `useQuizApi`, `useCourseApi`, `useExamAdminApi`), modal pembuatan butir soal baru (`QuestionEditor`), penautan soal ke kuis, dan penanganan error/retensi data.
   - **Pages**:
     - `CreateActivityPageView.tsx`: Mengkomposisi organism ke dalam layout halaman.
   - **App Router**:
     - `src/app/(protected)/dashboard/exams/create/page.tsx`: Server component dengan guard role `requireDashboardRoles(["TENANT", "TEACHER", "ADMIN"])`.

## 3. Audited Moodle Web Service Contract
Sesuai dengan **AGENTS.md Section 4.1** dan plugin `local_examapi` (v1.0.0-alpha):

| Service | Moodle WS Function | Status | Kegunaan |
|---|---|---|---|
| Question Bank | `local_examapi_get_questions` | CONTRACTED | Mengambil daftar butir soal dengan filter kategori, tipe, pencarian |
| Question Bank | `local_examapi_get_question_categories` | CONTRACTED | Mengambil daftar kategori Bank Soal berdasarkan context ID |
| Question Bank | `local_examapi_create_question` | CONTRACTED | Menyimpan butir soal baru ke Bank Soal |
| Question Bank | `local_examapi_create_question_category` | CONTRACTED | Membuat kategori baru pada Bank Soal |
| Quiz Composition | `local_examapi_add_question_to_quiz` | CONTRACTED | Menautkan butir soal dari Bank Soal ke kuis course |
| Quiz Composition | `local_examapi_add_random_questions` | CONTRACTED | Menambahkan soal acak dari kategori ke kuis |
| Quiz Composition | `local_examapi_get_quiz_questions` | CONTRACTED | Mengambil daftar slot pertanyaan pada kuis |

### Backend Readiness Transparency
- Pembuatan modul kuis murni baru secara utuh (`local_examapi_create_quiz`) dan pembuatan penugasan murni (`mod_assign_*`) berstatus **backend-contract-blocked** pada baseline plugin Moodle saat ini.
- Sistem tidak memalsukan keberhasilan (no mock success), melainkan secara transparan mengintegrasikan butir soal Bank Soal ke kuis-kuis aktif pada mata pelajaran tersebut, serta mencatat draf kurikulum materi dan tugas.
