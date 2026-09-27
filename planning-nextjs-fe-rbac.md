\# PLANNING — Next.js Exam SaaS Frontend/BFF

\#\# 1\. Objective

Membangun aplikasi SaaS ujian dengan arsitektur berikut:

\- \*\*Next.js\*\* sebagai frontend, BFF/API server, session layer, tenant resolver, authorization layer, dan application host.  
\- \*\*Moodle 5.x\*\* sebagai LMS backend, Quiz Engine, Question Engine, Gradebook, enrolment engine, serta source of truth untuk attempt dan hasil ujian.  
\- \*\*Prisma 7 \+ PostgreSQL\*\* hanya untuk metadata SaaS multi-tenant, credential terenkripsi, branding, session metadata bila diperlukan, dan audit internal SaaS.  
\- \*\*Hexagonal / DDD module boundary\*\* untuk setiap feature.  
\- \*\*Atomic UI\*\* untuk \`src/sections/\*\`.  
\- \*\*Vitest \+ TDD\*\* dengan alur \*\*RED → GREEN → REFACTOR\*\*.  
\- \*\*TypeScript strict\*\* dan \*\*Biome\*\*.  
\- \*\*RBAC\*\* dengan tiga role aplikasi: \`ADMIN\`, \`TENANT\`, \`STUDENT\`.  
\- \*\*Tidak menggunakan barrel export\*\* (\`index.ts\` / \`index.tsx\`) untuk re-export module, section, core, shared UI, atau API dependency.

Moodle tetap menjadi authoritative source untuk user akademik, course, enrolment, quiz, question, attempt, answer, dan grade. Next.js tidak boleh mengimplementasikan ulang Quiz Engine Moodle.

\---

\# 2\. Actor & Role Model

\#\# 2.1 Role aplikasi

\`\`\`ts  
export enum AppRole {  
  ADMIN \= "ADMIN",  
  TENANT \= "TENANT",  
  TEACHER \= "TEACHER",  
  PROCTOR \= "PROCTOR",  
  STUDENT \= "STUDENT",  
}  
\`\`\`

\#\#\# \`ADMIN\`

SaaS/system administrator. Tidak terikat ke satu tenant untuk operasi administrasi platform.

Tanggung jawab utama:  
\- membuat, mengubah, suspend, dan mengaktifkan tenant;  
\- mengatur Moodle endpoint dan service credential tenant;  
\- menguji koneksi tenant ke Moodle;  
\- melihat audit platform;  
\- mengelola konfigurasi global SaaS.

\#\#\# \`TENANT\`

Administrator/operator instansi. Semua operasi harus terikat ke \`tenantId\` yang terdapat pada session/context.

Tanggung jawab utama:  
\- dashboard instansi;  
\- user peserta;  
\- enrolment dan group/cohort;  
\- course dan quiz listing;  
\- question bank;  
\- exam administration;  
\- exam monitoring;  
\- hasil/nilai sesuai capability Moodle;  
\- branding tenant.

\#\#\# \`TEACHER\`

Tenaga pendidik pada suatu instansi. Semua operasi harus terikat ke \`tenantId\` dan dibatasi pada course/grup yang dikelolanya.

Tanggung jawab utama: mengelola course dan kuis, memonitor ujian berlangsung, dan melihat hasil/nilai peserta di kelasnya.

\#\#\# \`PROCTOR\`

Pengawas ujian lapangan. Semua operasi terikat pada \`tenantId\` dan dibatasi hanya pada sesi ujian yang sedang ditugaskan kepadanya.

Tanggung jawab utama: memonitor live status peserta, melakukan intervensi (seperti force-finish, force-logout, atau extend time) apabila terdeteksi kecurangan, dan memastikan kelancaran teknis sesi ujian.

\#\#\# \`STUDENT\`

Peserta ujian dari tenant tertentu.

Tanggung jawab utama:  
\- melihat course miliknya;  
\- melihat ujian yang tersedia;  
\- memulai/resume attempt miliknya;  
\- menjawab/autosave;  
\- submit;  
\- melihat review/result hanya jika diizinkan Moodle.

\---

\# 3\. RBAC System

\#\# 3.1 Permission constants

\`\`\`ts  
export const Permission \= {  
  ADMIN\_DASHBOARD\_READ: "admin.dashboard.read",  
  TENANT\_CREATE: "tenant.create",  
  TENANT\_READ: "tenant.read",  
  TENANT\_UPDATE: "tenant.update",  
  TENANT\_STATUS\_UPDATE: "tenant.status.update",  
  TENANT\_CONNECTION\_TEST: "tenant.connection.test",  
  PLATFORM\_AUDIT\_READ: "platform.audit.read",

  TENANT\_DASHBOARD\_READ: "tenant.dashboard.read",  
  TENANT\_BRANDING\_READ: "tenant.branding.read",  
  TENANT\_BRANDING\_UPDATE: "tenant.branding.update",  
  USER\_READ: "user.read",  
  USER\_CREATE: "user.create",  
  USER\_UPDATE: "user.update",  
  USER\_DEACTIVATE: "user.deactivate",  
  USER\_IMPORT: "user.import",  
  ENROLMENT\_READ: "enrolment.read",  
  ENROLMENT\_MANAGE: "enrolment.manage",  
  GROUP\_READ: "group.read",  
  GROUP\_MANAGE: "group.manage",  
  COURSE\_READ: "course.read",  
  QUIZ\_READ: "quiz.read",  
  QUESTION\_READ: "question.read",  
  QUESTION\_CREATE: "question.create",  
  QUESTION\_UPDATE: "question.update",  
  QUESTION\_DELETE: "question.delete",  
  EXAM\_CREATE: "exam.create",  
  EXAM\_UPDATE: "exam.update",  
  EXAM\_DELETE: "exam.delete",  
  EXAM\_MONITOR\_READ: "exam.monitor.read",  
  EXAM\_MONITOR\_ACTION: "exam.monitor.action",  
  GRADE\_READ: "grade.read",  
  TENANT\_AUDIT\_READ: "tenant.audit.read",

  STUDENT\_DASHBOARD\_READ: "student.dashboard.read",  
  STUDENT\_COURSE\_READ: "student.course.read",  
  STUDENT\_QUIZ\_READ: "student.quiz.read",  
  ATTEMPT\_START: "attempt.start",  
  ATTEMPT\_READ\_OWN: "attempt.read.own",  
  ATTEMPT\_SAVE\_OWN: "attempt.save.own",  
  ATTEMPT\_SUBMIT\_OWN: "attempt.submit.own",  
  ATTEMPT\_REVIEW\_OWN: "attempt.review.own",  
  GRADE\_READ\_OWN: "grade.read.own",  
} as const;  
\`\`\`

\#\# 3.2 Role-permission map

\`\`\`text  
ADMIN  
├── admin.dashboard.read  
├── tenant.create/read/update/status.update/connection.test  
└── platform.audit.read

TENANT  
├── tenant.dashboard.read  
├── tenant.branding.read/update  
├── user.read/create/update/deactivate/import  
├── enrolment.read/manage  
├── group.read/manage  
├── course.read  
├── quiz.read  
├── question.read/create/update/delete  
├── exam.create/update/delete  
├── exam.monitor.read/action  
├── grade.read  
└── tenant.audit.read

TEACHER  
├── teacher.dashboard.read  
├── course.read  
├── quiz.read/create  
├── exam.monitor.read  
└── grade.read

PROCTOR  
├── proctor.dashboard.read  
├── exam.monitor.read  
└── exam.monitor.action

STUDENT  
├── student.dashboard.read  
├── student.course.read  
├── student.quiz.read  
├── attempt.start  
├── attempt.read.own  
├── attempt.save.own  
├── attempt.submit.own  
├── attempt.review.own  
└── grade.read.own  
\`\`\`

\#\# 3.3 Authorization rules

Authorization \*\*tidak boleh\*\* hanya dilakukan di UI.

Wajib dilakukan pada tiga lapis:  
1\. \*\*Server layout/page guard\*\* untuk route role.  
2\. \*\*API/controller guard\*\* sebelum request mencapai application use case.  
3\. \*\*Application/domain ownership rule\*\* untuk memastikan actor hanya mengakses resource yang diperbolehkan.

\#\# 3.4 Tenant isolation

\- \`TENANT\` selalu memiliki \`tenantId\` di actor/session.  
\- \`STUDENT\` selalu memiliki \`tenantId\` di actor/session.  
\- \`TEACHER\` selalu memiliki \`tenantId\` di actor/session.  
\- \`PROCTOR\` selalu memiliki \`tenantId\` di actor/session.  
\- tenant target tidak boleh diambil dari body/query sebagai source of truth jika sudah tersedia dari session.  
\- \`ADMIN\` boleh memilih tenant target secara eksplisit untuk operasi administrasi platform.  
\- setiap factory Moodle harus menerima tenant context yang sudah tervalidasi.  
\- token Tenant A tidak pernah boleh digunakan ke Moodle Tenant B.

\---

\# 4\. Request Flow

\`\`\`text  
Browser  
  ↓  
sections/\*  
  ↓  
modules/\*/presentation/hooks  
  ↓  
app/api/\*/route.ts  
  ↓  
\_factory.ts  
  ↓  
Infrastructure HTTP Controller  
  ↓  
RBAC authorization  
  ↓  
Application Service / Use Case  
  ↓  
Domain Port / Rule  
  ↓  
Infrastructure Repository / Provider  
  ↓  
Moodle REST / Prisma SaaS DB / Cache  
\`\`\`

Rules:  
\- \`domain\` tidak import React, Next.js, Prisma, Moodle REST client, \`fetch\`, atau infrastructure.  
\- \`application\` hanya bergantung pada domain/core abstraction.  
\- \`infrastructure\` mengimplementasikan port domain dan integrasi eksternal.  
\- \`presentation/hooks\` hanya memanggil internal Next.js API.  
\- \`sections/atoms\` dan \`sections/molecules\` tidak memanggil API.  
\- \`sections/organisms\` boleh memakai presentation hook.  
\- \`src/app/\*\*/page.tsx\` hanya compose \`sections/\*\*/pages/\*\`.  
\- API route harus tipis.  
\- Browser tidak pernah memanggil Moodle secara langsung.

\---

\# 5\. Mandatory No-Barrel Policy

Project \*\*tidak menggunakan barrel export\*\*.

Dilarang:  
\`\`\`text  
src/modules/auth/index.ts  
src/modules/auth/domain/index.ts  
src/sections/auth/index.ts  
src/core/index.ts  
src/shared-ui/index.ts  
\`\`\`

\`index.ts\` hanya diperbolehkan jika file tersebut memang entry-point runtime milik library eksternal/generated code dan bukan barrel buatan project.

\---

\# 6\. Standard Module Pattern

Semua module \*\*WAJIB\*\* mengikuti satu pola canonical. Struktur tidak boleh berubah per feature hanya karena implementasinya berbeda.

\#\# 6.1 Interface ownership — mandatory

\*\*Seluruh port/interface yang dibutuhkan application service atau use case dimiliki oleh domain.\*\*

Satu module memakai satu contract file utama:  
\`\`\`text  
domain/interfaces/{Feature}Interfaces.ts  
\`\`\`

\#\# 6.2 Validator ownership

\`domain/validators/{Feature}Validator.ts\` menangani domain invariant, business rule, valid state transition.

\`infrastructure/validators/{feature}.validator.ts\` menangani HTTP request payload, parameter query, schema external API.

\#\# 6.3 Naming rules

\- \`entity\`, bukan \`entities\`;  
\- \`repo\`, bukan \`repositories\`;  
\- DTO memakai suffix \`Dto\`;  
\- satu contract file module: \`{Feature}Interfaces.ts\`;  
\- tidak menggunakan barrel export.

\---

\# 7\. Standard Sections Pattern

\`\`\`text  
src/sections/{feature}/  
├── atoms/       (props only, no API)  
├── molecules/   (props \+ callback, no API)  
├── organisms/   (state coordinator, boleh memakai hook)  
└── pages/       (compose organisms/molecules)  
\`\`\`

\---

\# 8\. App Router — Protected / Public Dashboard Structure

Struktur page pada \`src/app\` \*\*wajib\*\* menggunakan dua route group utama: \`(protected)\` dan \`(public)\`.

\#\# 8.1 Canonical \`src/app\` page structure  
Tidak ada root route terpisah per role seperti \`(admin)\` atau \`(student)\`. Semua user authenticated masuk via \`/dashboard\` lalu dibatasi oleh RBAC.

\#\# 8.2 Protected layout  
\`(protected)/layout.tsx\` adalah boundary otentikasi global. Validasi role spesifik tetap dijalankan pada komponen halaman maupun di sisi backend API.

\#\# 8.3 Dashboard composition  
\`src/app/(protected)/dashboard/page.tsx\` akan melakukan render-level composition:  
\`\`\`tsx  
const actor \= await resolveCurrentActor();  
switch (actor.role) {  
  case AppRole.ADMIN: return \<AdminDashboard /\>;  
  case AppRole.TENANT: return \<TenantDashboard /\>;  
  case AppRole.STUDENT: return \<StudentDashboard /\>;  
}  
\`\`\`

\#\# 8.4 Role-Based Menu & Web Service Mapping

Berikut adalah struktur menu sidebar untuk masing-masing role berserta Moodle Web Service (Core & Custom) yang diakses di balik layar.

\#\#\# ADMIN Menu  
\- \*\*Dashboard\*\*: Statistik global SaaS, status operasional (Prisma DB).  
\- \*\*Tenant Management\*\*: CRUD Tenant, atur batas kuota, toggle status aktif/suspend (Prisma DB).  
\- \*\*Moodle Integrations\*\*: Konfigurasi credentials Moodle per tenant, testing koneksi (\`core\_webservice\_get\_site\_info\`).  
\- \*\*Audit Logs\*\*: Pantauan aktivitas kritis sistem (Prisma DB).

\#\#\# TENANT Menu  
\- \*\*Dashboard\*\*: Statistik ujian berjalan, ringkasan peserta (\`local\_exam\_get\_exam\_statistics\`).  
\- \*\*User Management\*\*: Import dan CRUD peserta/guru, (\`core\_user\_\*\`, \`local\_exam\_import\_students\`).  
\- \*\*Enrolment & Groups\*\*: Pengelompokan siswa ke dalam course/cohort (\`core\_enrol\_\*\`, \`core\_group\_\*\`).  
\- \*\*Course Catalog\*\*: Manajemen modul kelas/mata pelajaran (\`core\_course\_\*\`).  
\- \*\*Question Bank\*\*: CRUD dan kategori soal (\`local\_exam\_get\_question\_categories\`, \`local\_exam\_create\_question\`, \`local\_exam\_bulk\_create\_questions\`, dsb).  
\- \*\*Exam Configuration\*\*: Setup ujian, durasi, komposisi soal (\`local\_exam\_create\_quiz\`, \`local\_exam\_add\_question\_to\_quiz\`, \`local\_exam\_reorder\_quiz\_questions\`).  
\- \*\*Exam Monitor\*\*: Real-time overview, blokir siswa, force-finish, penambahan waktu (\`local\_exam\_get\_exam\_monitor\`, \`local\_exam\_force\_finish\_attempt\`, \`local\_exam\_extend\_attempt\_time\`, \`local\_exam\_force\_logout\_user\`).  
\- \*\*Results & Exports\*\*: Nilai kumulatif, export analisis butir soal (\`local\_exam\_get\_exam\_results\`, \`local\_exam\_export\_results\`).  
\- \*\*Branding\*\*: Kustomisasi logo/warna untuk tampilan ujian (Prisma DB).

\#\#\# TEACHER Menu  
\- \*\*Dashboard\*\*: Ringkasan kelas yang diajar (\`core\_course\_get\_courses\_by\_field\`).  
\- \*\*My Courses\*\*: Daftar modul dan materi per kelas (\`core\_course\_get\_contents\`).  
\- \*\*Quiz Setup\*\*: Membuat atau menyalin ujian dari bank soal (jika diberi akses) (\`local\_exam\_create\_quiz\`, \`local\_exam\_get\_question\_bank\`).  
\- \*\*Class Exam Monitor\*\*: Memantau ujian aktif khusus di kelasnya, reset/unlock percobaan yang gagal (\`local\_exam\_get\_active\_attempts\`, \`local\_exam\_unlock\_attempt\`, \`local\_exam\_reset\_attempt\`).  
\- \*\*Class Results\*\*: Lihat nilai dan grading report siswa yang diajarnya (\`gradereport\_user\_get\_grades\_table\`, \`core\_grades\_get\_grades\`).

\#\#\# PROCTOR Menu  
\- \*\*Proctor Dashboard\*\*: Menampilkan daftar sesi ujian aktif yang ditugaskan hari ini (\`local\_exam\_get\_active\_attempts\`).  
\- \*\*Live Monitor & Anti-Cheat\*\*: Papan pengawasan real-time peserta ujian, status koneksi, dan laporan anomali (\`local\_exam\_get\_exam\_monitor\`).  
\- \*\*Incident Intervention\*\*: Aksi penindakan kecurangan seperti blokir peserta (\`local\_exam\_force\_logout\_user\`), paksa selesai (\`local\_exam\_force\_finish\_attempt\`), atau buka akses ulang jika terputus (\`local\_exam\_unlock\_attempt\`).

\#\#\# STUDENT Menu  
\- \*\*My Dashboard\*\*: Ujian yang akan datang dan kelas terdaftar (\`core\_enrol\_get\_users\_courses\`, \`mod\_quiz\_get\_quizzes\_by\_courses\`).  
\- \*\*Exam Portal\*\*: Laman utama memulai ujian (\`mod\_quiz\_get\_quiz\_access\_information\`, \`mod\_quiz\_start\_attempt\`).  
\- \*\*Attempt Interface\*\*: Menjawab ujian & autosave (\`mod\_quiz\_get\_attempt\_data\`, \`mod\_quiz\_save\_attempt\`, \`mod\_quiz\_process\_attempt\`).  
\- \*\*My Grades\*\*: Laporan histori nilai mandiri (\`mod\_quiz\_get\_user\_best\_grade\`, \`gradereport\_user\_get\_grades\_table\`).

\---

\# 11\. Module Map

\#\# 11.1 \`auth\`  
\- \`/login/token.php\`  
\- \`core\_webservice\_get\_site\_info\`

\#\# 11.2 \`tenant\`  
\- \`TenantCredentialProviderInterface\` (Enkripsi credentials).

\#\# 11.3 \`courses\`  
Moodle:  
\- \`core\_enrol\_get\_users\_courses\`  
\- \`core\_course\_get\_courses\_by\_field\`  
\- \`core\_course\_get\_contents\`

\#\# 11.4 \`quizzes\`  
Moodle:  
\- \`mod\_quiz\_get\_quizzes\_by\_courses\`  
\- \`mod\_quiz\_get\_quiz\_access\_information\`  
\- \`mod\_quiz\_get\_quiz\_required\_qtypes\`

\#\# 11.5 \`quiz-attempts\`  
Moodle:  
\- \`mod\_quiz\_get\_user\_quiz\_attempts\` (Moodle 5.0 standar menggantikan endpoint lama)  
\- \`mod\_quiz\_get\_attempt\_access\_information\`  
\- \`mod\_quiz\_start\_attempt\`  
\- \`mod\_quiz\_get\_attempt\_data\`  
\- \`mod\_quiz\_save\_attempt\`  
\- \`mod\_quiz\_get\_attempt\_summary\`  
\- \`mod\_quiz\_process\_attempt\`  
\- \`mod\_quiz\_get\_attempt\_review\`

\#\# 11.6 \`grades\`  
\- \`core\_grades\_get\_grades\` / \`gradereport\_\*\`

\---

\# 12\. Hybrid Storage Strategy

\*\*Moodle Database\*\*: Authoritative untuk data akademik (user, course, kuis, nilai, jawaban).  
\*\*Next.js SaaS Database\*\*: Metadata operasional (tenant, token/credentials enkripsi, logs, custom branding).

\---

\# 19\. Moodle Adapter

\`MoodleRestClient\` menangani: POST REST, parameter encoding, timeout, exception mapping, secret-safe logging. Tidak boleh \*fetch\* langsung ke Moodle di luar service layer ini.

\---

\# 20\. Custom Moodle API Boundary — \`local\_examapi\`

Kontrak custom Moodle direpresentasikan melalui Web Service \`local\_exam\_\` yang terdaftar. Endpoint ini menjembatani batas API core Moodle 5.0 untuk kebutuhan headless/SaaS.

Function kustom yang terdaftar dan telah tervalidasi untuk implementasi di \`cybertank378/moodle\_mod/local\_examapi\`:

\*\*Question Bank & Bank Operations\*\*  
\- \`local\_exam\_get\_question\_categories\`  
\- \`local\_exam\_create\_question\_category\`  
\- \`local\_exam\_get\_question\_bank\`  
\- \`local\_exam\_create\_question\`  
\- \`local\_exam\_update\_question\`  
\- \`local\_exam\_delete\_question\`  
\- \`local\_exam\_move\_question\`  
\- \`local\_exam\_bulk\_create\_questions\`  
\- \`local\_exam\_import\_questions\`

\*\*Quiz Composition & Lifecycle\*\*  
\- \`local\_exam\_create\_quiz\`  
\- \`local\_exam\_update\_quiz\`  
\- \`local\_exam\_delete\_quiz\`  
\- \`local\_exam\_duplicate\_quiz\`  
\- \`local\_exam\_get\_quiz\_questions\`  
\- \`local\_exam\_add\_question\_to\_quiz\`  
\- \`local\_exam\_remove\_question\_from\_quiz\`  
\- \`local\_exam\_reorder\_quiz\_questions\`  
\- \`local\_exam\_add\_random\_questions\`

\*\*Exam Monitor & Incident Handling\*\*  
\- \`local\_exam\_get\_exam\_monitor\`  
\- \`local\_exam\_get\_active\_attempts\`  
\- \`local\_exam\_force\_finish\_attempt\`  
\- \`local\_exam\_force\_logout\_user\`  
\- \`local\_exam\_reset\_attempt\`  
\- \`local\_exam\_extend\_attempt\_time\`  
\- \`local\_exam\_unlock\_attempt\`

\*\*Results, Statistics & Roster\*\*  
\- \`local\_exam\_get\_exam\_statistics\`  
\- \`local\_exam\_get\_exam\_participants\`  
\- \`local\_exam\_get\_exam\_results\`  
\- \`local\_exam\_export\_results\`  
\- \`local\_exam\_import\_students\`

Nama function ini menjadi kontrak sah untuk infrastructure adapter SaaS Backend Anda dan menimpa asumsi planning sebelumnya. Area yang membutuhkan intervensi API dari plugin (seperti \`local\_exam\_\`) menandakan bahwa Endpoint Core dari Moodle tidak secara elegan memenuhi model SaaS/Headless.

\---

\# 21\. TDD Standard  
\- \*\*RED → GREEN → REFACTOR\*\*. Test dilarang mengimpor barrel. Gunakan mocking untuk domain ports (repository).

\---

\# 23\. Sequential Implementation Issues  
Implementasi berurutan dari \`01\` hingga \`20\` tanpa menggunakan subfolder. Foundation dan RBAC → Tenant Auth → Dashboard → Courses → Quizzes → Exam UI → Results → Tenant & Exam Admin/Monitor → Audit.

\---

\# 24\. Definition of Done per Feature  
Harus memenuhi kaidah Domain Boundary yang bersih, bebas \`barrel export\`, Type Safe, Moodle credentials tidak terekspos ke Client, dan UI mengikuti atomik layer yang terstruktur.