# Student Dashboard Design Specification

## 1. Tujuan

Dokumen ini mendefinisikan desain dashboard **role siswa** untuk
`next_moodle` pada branch `development`.

Dashboard harus menjadi halaman utama siswa yang membantu mereka
melihat:

-   mata pelajaran yang sedang diikuti;
-   progres belajar;
-   tugas dan deadline;
-   kalender akademik;
-   jadwal kegiatan;
-   nilai terbaru;
-   pengumuman;
-   notifikasi;
-   aktivitas yang perlu segera dikerjakan;
-   akses cepat ke materi dan aktivitas Moodle.

> Catatan implementasi: repository `cybertank378/next_moodle` branch
> `development` menjadi target implementasi. Struktur komponen dan API
> yang sudah ada di repository harus dipertahankan dan digunakan kembali
> apabila tersedia. Hindari membuat ulang komponen global yang sudah
> dimiliki project.

------------------------------------------------------------------------

## 2. Prinsip Desain

### 2.1 Student-first

Informasi paling penting harus terlihat tanpa perlu membuka banyak
halaman:

1.  Apa yang harus saya kerjakan?
2.  Kapan deadline-nya?
3.  Kelas apa yang sedang saya ikuti?
4.  Bagaimana progres saya?
5.  Apa jadwal saya hari ini?
6.  Apakah ada pengumuman atau pesan baru?

### 2.2 Responsive

Dashboard harus nyaman digunakan pada:

-   Desktop: `>= 1280px`
-   Tablet: `768px - 1279px`
-   Mobile: `< 768px`

Mobile bukan sekadar versi desktop yang diperkecil. Urutan konten harus
diubah berdasarkan prioritas.

### 2.3 Accessible

Gunakan:

-   semantic HTML;
-   keyboard navigation;
-   visible focus state;
-   ARIA hanya ketika diperlukan;
-   kontras warna yang memadai;
-   jangan menjadikan warna sebagai satu-satunya indikator status;
-   ukuran touch target minimal sekitar 44px.

------------------------------------------------------------------------

# 3. Struktur Layout

## Desktop

Gunakan layout 3 area:

``` text
┌─────────────────────────────────────────────────────────────────────────────┐
│ Header                                                                      │
│ Logo | Search | Notifications | Messages | Help | Avatar                    │
├───────────────┬─────────────────────────────────────────────┬───────────────┤
│               │                                             │               │
│ Sidebar       │ Main Dashboard                              │ Right Rail    │
│               │                                             │               │
│ Dashboard     │ Greeting                                    │ Calendar      │
│ My Courses    │                                             │               │
│ Calendar      │ Stats                                       │ Upcoming      │
│ Tasks         │                                             │ Deadlines     │
│ Grades        │                                             │               │
│ Messages      │ Courses                                     │               │
│ Notifications │                                             │               │
│               │ Activity / Assignments                      │               │
│               │                                             │               │
│               │ Announcements                               │               │
└───────────────┴─────────────────────────────────────────────┴───────────────┘
```

Rekomendasi:

-   Sidebar: `240px - 264px`
-   Main content: fleksibel
-   Right rail: `300px - 360px`
-   Gap antar kolom: `20px - 24px`

Pada layar lebih kecil, right rail turun ke bawah main content.

------------------------------------------------------------------------

# 4. Header

## Komponen

Header berisi:

-   logo / nama platform;
-   global search;
-   notification button;
-   message button;
-   help button;
-   avatar siswa;
-   dropdown profil.

### Search

Placeholder:

> Cari mata pelajaran, materi, tugas...

Hasil pencarian dapat mengarah ke:

-   course;
-   activity;
-   assignment;
-   resource;
-   announcement.

### Notification

Badge menunjukkan jumlah notifikasi belum dibaca.

Contoh:

``` text
🔔 3
```

Dropdown:

``` text
Notifications

[NEW] Tugas Pemrograman Web
Deadline besok, 23:59

[NEW] Pengumuman dari Guru
Perubahan jadwal pelajaran

[NEW] Nilai tersedia
Pemrograman Dasar
```

------------------------------------------------------------------------

# 5. Sidebar Navigation

Menu role siswa:

``` text
Dashboard
Mata Pelajaran
Kalender
Tugas
Nilai
Pesan
Notifikasi
────────────
Profil
Pengaturan
Bantuan
Keluar
```

Menu aktif harus memiliki:

-   active background;
-   active indicator;
-   icon;
-   accessible label.

Sidebar desktop dapat collapse menjadi mode icon-only.

Mobile menggunakan drawer/bottom navigation sesuai pola UI yang sudah
digunakan project.

------------------------------------------------------------------------

# 6. Student Greeting

Bagian paling atas main content.

Contoh:

``` text
Selamat pagi, Rahman 👋

Berikut ringkasan aktivitas belajar kamu hari ini.

[3 tugas belum selesai] [2 kelas hari ini] [78% rata-rata progres]
```

Jika nama siswa tersedia dari session/API, gunakan nama asli dari data
user.

Jangan hardcode nama.

------------------------------------------------------------------------

# 7. Summary Cards

Empat kartu utama:

### Card 1 --- Mata Pelajaran

``` text
12
Mata Pelajaran Aktif
```

Action:

> Lihat semua

### Card 2 --- Tugas

``` text
5
Tugas Belum Selesai
```

Status warna:

-   normal;
-   due soon;
-   overdue.

### Card 3 --- Deadline

``` text
2
Deadline Minggu Ini
```

### Card 4 --- Progress

``` text
78%
Rata-rata Progress
```

Jika data nilai/progress belum tersedia, tampilkan empty state yang
jelas.

------------------------------------------------------------------------

# 8. My Courses

Section:

``` text
Mata Pelajaran Saya                         Lihat Semua →
```

Gunakan grid card.

Setiap course card:

``` text
┌─────────────────────────────────────┐
│ [Course thumbnail]                  │
│                                     │
│ Pemrograman Web                     │
│ IF204                               │
│                                     │
│ Progress                            │
│ ███████████░░░░ 72%                 │
│                                     │
│ 8 dari 12 aktivitas selesai         │
│                                     │
│ [Lanjutkan Belajar →]               │
└─────────────────────────────────────┘
```

Data minimal:

-   course name;
-   short name/code;
-   image;
-   progress;
-   completed activity;
-   total activity;
-   last accessed;
-   teacher/instructor jika tersedia.

### Course card states

1.  Active
2.  Completed
3.  Not started
4.  Archived/unavailable

------------------------------------------------------------------------

# 9. Continue Learning

Tambahkan section khusus untuk aktivitas terakhir:

``` text
Lanjutkan Belajar

Pemrograman Web
Modul 4 — REST API
Progress: 64%

[Lanjutkan →]
```

Tujuannya mengurangi friction dari dashboard menuju aktivitas terakhir.

Prioritas:

1.  course terakhir dibuka;
2.  activity terakhir;
3.  activity berikutnya yang direkomendasikan.

------------------------------------------------------------------------

# 10. Upcoming Deadlines

Section:

``` text
Tugas & Deadline                         Lihat Semua →
```

Contoh:

``` text
┌────────────────────────────────────────────────────┐
│ 🔴 Besok                                          │
│ Tugas REST API                                    │
│ Pemrograman Web                                   │
│ Deadline: 6 Oktober 2026, 23:59                  │
│                                      [Buka →]      │
├────────────────────────────────────────────────────┤
│ 🟡 8 Oktober                                      │
│ Quiz Database                                     │
│ Basis Data                                        │
│ Deadline: 8 Oktober 2026, 10:00                  │
│                                      [Buka →]      │
└────────────────────────────────────────────────────┘
```

Status:

-   Overdue
-   Due today
-   Due tomorrow
-   This week
-   Later

Jangan hanya menggunakan warna; tampilkan label tekstual.

------------------------------------------------------------------------

# 11. Calendar

Calendar menjadi komponen inti dashboard.

## Mini Calendar

Letakkan pada right rail desktop.

``` text
October 2026
‹                    ›

Mo Tu We Th Fr Sa Su
       1  2  3  4
 5  6  7  8  9 10 11
12 13 14 15 16 17 18
19 20 21 22 23 24 25
26 27 28 29 30 31

• Class
• Assignment
• Quiz
• Event
```

Hari aktif diberi highlight.

Tanggal yang memiliki event menampilkan indicator.

## Full Calendar

Halaman `/calendar` harus menyediakan:

-   Month view;
-   Week view;
-   Day view;
-   Today;
-   previous/next;
-   filter;
-   create event jika permission mengizinkan;
-   klik event untuk detail.

### Calendar filters

``` text
☑ Semua
☑ Kelas
☑ Tugas
☑ Quiz
☑ Ujian
☑ Event
```

### Event detail

``` text
Tugas REST API

Pemrograman Web

6 Oktober 2026
23:59

Status: Belum dikumpulkan

[Buka Tugas]
```

------------------------------------------------------------------------

# 12. Today's Schedule

Section:

``` text
Jadwal Hari Ini
```

Contoh:

``` text
08:00 ─────────────────────────
       Pemrograman Web
       Ruang Lab 2
       08:00 - 10:00

10:30 ─────────────────────────
       Basis Data
       Ruang 304
       10:30 - 12:00

13:00 ─────────────────────────
       Diskusi Project
       Online
       13:00 - 14:00
```

Event yang sedang berlangsung diberi indikator:

``` text
● Sedang berlangsung
```

------------------------------------------------------------------------

# 13. Recent Grades

Section:

``` text
Nilai Terbaru                            Lihat Semua →
```

Contoh:

``` text
Quiz HTML & CSS             90/100
Pemrograman Web             88/100
Assignment ERD              85/100
Quiz SQL                    92/100
```

Tampilkan:

-   activity;
-   course;
-   score;
-   maximum score;
-   feedback indicator;
-   date.

Jika feedback tersedia:

``` text
💬 Feedback tersedia
```

------------------------------------------------------------------------

# 14. Progress Overview

Gunakan visualisasi sederhana.

``` text
Progress Belajar

Pemrograman Web       ███████████████░░░ 82%
Basis Data            ███████████░░░░░░░ 65%
Matematika Diskrit    █████████████░░░░░ 74%
Sistem Operasi        ████████░░░░░░░░░░ 48%
```

Jangan membuat dashboard terlalu bergantung pada chart berat. Progress
bar dan angka cukup untuk informasi cepat.

------------------------------------------------------------------------

# 15. Announcements

Section:

``` text
Pengumuman Terbaru                    Lihat Semua →
```

Card:

``` text
Pengumpulan Tugas Akhir

Pemrograman Web
Guru Pengampu: John Doe

Deadline pengumpulan tugas diperpanjang
hingga 12 Oktober 2026.

5 menit lalu
```

Tampilkan:

-   title;
-   course;
-   author;
-   timestamp;
-   unread state;
-   attachment indicator jika tersedia.

------------------------------------------------------------------------

# 16. Recent Activity

Activity feed:

``` text
Aktivitas Terbaru

10:20
Kamu menyelesaikan Modul 4
Pemrograman Web

Kemarin
Kamu mengumpulkan Tugas REST API
Pemrograman Web

Kemarin
Nilai Quiz SQL tersedia
Basis Data
```

Gunakan timeline ringan.

------------------------------------------------------------------------

# 17. Quick Actions

Sediakan shortcut:

``` text
[📚 Mata Pelajaran]
[📅 Kalender]
[📝 Tugas]
[📊 Nilai]
[💬 Pesan]
```

Quick actions paling cocok diletakkan setelah greeting atau summary
cards.

------------------------------------------------------------------------

# 18. Empty States

Semua section harus mempunyai empty state.

### Tidak ada tugas

``` text
🎉 Tidak ada tugas yang harus dikumpulkan.

Kamu sudah menyelesaikan semua tugas saat ini.
```

### Tidak ada event

``` text
Tidak ada kegiatan untuk hari ini.
```

### Tidak ada nilai

``` text
Belum ada nilai yang tersedia.
```

### Tidak ada course

``` text
Belum ada mata pelajaran yang terdaftar.

Hubungi administrator jika data mata pelajaran belum tersedia.
```

------------------------------------------------------------------------

# 19. Loading States

Gunakan skeleton, bukan spinner penuh untuk seluruh halaman.

Contoh course:

``` text
┌─────────────────────────┐
│ ███████████████████     │
│                         │
│ █████████████           │
│ ████████                │
│                         │
│ █████████████████       │
└─────────────────────────┘
```

Loading harus dilakukan per section sehingga bagian yang sudah siap
dapat langsung ditampilkan.

------------------------------------------------------------------------

# 20. Error States

Setiap widget dapat gagal secara independen.

Contoh:

``` text
Tidak dapat memuat kalender.

[ Coba Lagi ]
```

Jangan membuat seluruh dashboard blank hanya karena satu API gagal.

------------------------------------------------------------------------

# 21. Responsive Behavior

## Desktop

``` text
Header
Sidebar + Main + Right Rail
```

## Tablet

``` text
Header
Sidebar collapsed
Main
Right Rail → full-width section
```

## Mobile

Urutan:

``` text
Header
Greeting
Quick Actions
Summary
Upcoming Deadlines
Today's Schedule
Continue Learning
Courses
Calendar
Grades
Announcements
Recent Activity
```

Sidebar berubah menjadi drawer.

Summary cards menggunakan horizontal scroll atau 2-column grid.

Course cards menjadi single-column.

------------------------------------------------------------------------

# 22. Visual Design

Gunakan design system yang sudah tersedia di project.

Prioritas:

-   jangan membuat warna baru jika token warna sudah tersedia;
-   gunakan typography scale existing;
-   gunakan spacing token existing;
-   gunakan border radius existing;
-   gunakan shadow existing;
-   gunakan icon library yang sudah dipakai project.

Jika project belum mempunyai design token yang konsisten, gunakan
baseline:

``` text
Spacing:
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48

Radius:
8px
12px
16px

Content max width:
1440px

Card padding:
20px - 24px
```

Visual harus terasa modern, bersih, dan akademik; hindari dashboard yang
terlalu ramai.

------------------------------------------------------------------------

# 23. Recommended Component Structure

Sesuaikan dengan struktur source code aktual repository.

Konsep komponen:

``` text
StudentDashboard
├── DashboardHeader
├── StudentGreeting
├── QuickActions
├── SummaryCards
│   ├── CourseSummaryCard
│   ├── AssignmentSummaryCard
│   ├── DeadlineSummaryCard
│   └── ProgressSummaryCard
├── CourseSection
│   └── CourseCard
├── ContinueLearning
├── UpcomingDeadlines
│   └── DeadlineItem
├── CalendarWidget
├── TodaySchedule
│   └── ScheduleItem
├── GradeOverview
├── ProgressOverview
├── AnnouncementSection
│   └── AnnouncementItem
└── RecentActivity
```

Jangan membuat duplikasi component jika component yang setara sudah
tersedia.

------------------------------------------------------------------------

# 24. Data Requirements

Dashboard membutuhkan data berikut.

## User

``` text
id
name
avatar
email
role
```

## Course

``` text
id
name
shortname
image
progress
completedActivities
totalActivities
lastAccessed
```

## Assignment

``` text
id
courseId
name
description
duedate
status
submissionStatus
```

## Calendar Event

``` text
id
title
type
courseId
start
end
description
url
```

## Grade

``` text
id
courseId
activityId
activityName
grade
maxGrade
feedback
date
```

## Announcement

``` text
id
courseId
title
content
author
createdAt
isRead
```

------------------------------------------------------------------------

# 25. API / Data Layer

Prioritaskan data source yang sudah tersedia pada repository.

Jangan membuat mock data permanen di production component.

Gunakan pola:

``` text
UI Component
      ↓
Dashboard Data Hook / Service
      ↓
Moodle API / Backend
```

Jika project menggunakan React Query/TanStack Query, SWR, server
actions, atau data fetching pattern lain, ikuti pola existing project.

Dashboard sebaiknya melakukan parallel fetching untuk section
independen:

``` text
User
Courses
Assignments
Calendar
Grades
Announcements
Activity
```

Gunakan caching agar perpindahan halaman tidak menyebabkan seluruh
dashboard reload.

------------------------------------------------------------------------

# 26. Moodle Integration

Dashboard harus mengikuti konsep data Moodle, bukan membuat sistem LMS
terpisah.

Contoh mapping:

  Dashboard     Moodle concept
  ------------- ----------------------------
  Mata Pelajaran   Courses
  Tugas         Assignments
  Kalender      Calendar events
  Nilai         Gradebook
  Pengumuman    Course/forum announcements
  Aktivitas     Course activity
  Progress      Course/activity completion
  Pesan         Messaging

Implementasi harus menghormati permission/capability Moodle. Data yang
tidak boleh dilihat siswa tidak boleh dikirim ke client hanya untuk
kemudian disembunyikan oleh UI.

------------------------------------------------------------------------

# 27. URL / Routing

Gunakan routing pattern existing project.

Target UX:

``` text
/dashboard
/courses
/courses/:id
/calendar
/assignments
/grades
/messages
/notifications
/profile
/settings
```

Jika project sudah memiliki route berbeda, gunakan route existing dan
jangan melakukan breaking change hanya demi mengikuti daftar ini.

------------------------------------------------------------------------

# 28. Accessibility Checklist

-   [ ] Semua tombol mempunyai accessible name.
-   [ ] Semua icon-only button mempunyai tooltip/aria-label.
-   [ ] Keyboard dapat berpindah ke semua interactive element.
-   [ ] Focus state terlihat.
-   [ ] Calendar dapat dinavigasi menggunakan keyboard.
-   [ ] Status tidak hanya dibedakan menggunakan warna.
-   [ ] Modal/drawer mempunyai focus management.
-   [ ] Heading hierarchy benar.
-   [ ] Form mempunyai label.
-   [ ] Loading state dapat diumumkan jika diperlukan.
-   [ ] Error state mempunyai pesan yang jelas.

------------------------------------------------------------------------

# 29. Performance

Target:

-   initial dashboard tidak melakukan request yang tidak diperlukan;
-   section independen dapat loading secara terpisah;
-   gambar course menggunakan lazy loading;
-   calendar tidak memuat seluruh event historis;
-   gunakan pagination/infinite loading untuk list panjang;
-   hindari rendering ulang semua course ketika satu widget berubah.

Untuk mobile:

-   prioritaskan tugas/deadline dan jadwal;
-   defer widget yang tidak langsung terlihat.

------------------------------------------------------------------------

# 30. Interaction Rules

### Course Card

Click card:

``` text
→ Course detail
```

### Deadline

Click:

``` text
→ Assignment detail
```

### Calendar Event

Click:

``` text
→ Event detail
```

### Grade

Click:

``` text
→ Grade / activity detail
```

### Announcement

Click:

``` text
→ Announcement detail
```

### Continue Learning

Click:

``` text
→ Activity terakhir / aktivitas berikutnya
```

------------------------------------------------------------------------

# 31. Notification Rules

Notification badge harus:

-   hanya menampilkan unread;
-   dapat dibuka tanpa meninggalkan dashboard;
-   memiliki action `Mark as read`;
-   menyediakan `Mark all as read`.

Jenis:

``` text
Assignment
Grade
Announcement
Message
Calendar
System
```

------------------------------------------------------------------------

# 32. Calendar UX Rules

Calendar harus:

1.  menampilkan tanggal sekarang;
2.  menyediakan Today;
3.  menyediakan previous/next;
4.  memiliki filter;
5.  membedakan event berdasarkan type;
6.  dapat membuka detail event;
7.  menampilkan deadline assignment;
8.  menampilkan quiz/exam bila tersedia;
9.  mempertahankan timezone user;
10. tidak menampilkan event yang tidak boleh diakses siswa.

Timezone jangan hardcode ke WIB; gunakan timezone user/Moodle
configuration.

------------------------------------------------------------------------

# 33. Mobile Bottom Navigation

Untuk mobile, gunakan maksimal 5 item:

``` text
┌──────────────────────────────────────────────┐
│ 🏠       📚       📅       📝       👤      │
│ Home    Courses Calendar   Tasks   Profile   │
└──────────────────────────────────────────────┘
```

Menu lain berada di More/Profile.

------------------------------------------------------------------------

# 34. Security

Frontend bukan security boundary.

Pastikan:

-   authorization dilakukan server-side;
-   student hanya menerima course/data yang memang boleh diakses;
-   jangan expose token Moodle;
-   jangan menaruh credential di client;
-   validate route parameters;
-   escape/render rich text sesuai sanitization policy;
-   jangan percaya `role=student` dari request client.

------------------------------------------------------------------------

# 35. Testing

## Component Tests

Minimal:

-   Summary cards render;
-   course card render;
-   deadline status;
-   calendar event;
-   empty state;
-   loading state;
-   error state.

## Integration Tests

Test:

``` text
Login as student
→ Open dashboard
→ Courses loaded
→ Assignment displayed
→ Calendar displayed
→ Click assignment
→ Assignment detail opened
```

## Responsive Tests

Test:

-   1440px;
-   1280px;
-   1024px;
-   768px;
-   390px.

## Accessibility

Gunakan automated accessibility testing jika tooling project mendukung.

------------------------------------------------------------------------

# 36. Definition of Done

Dashboard role siswa dianggap selesai apabila:

-   [ ] Student dashboard dapat dibuka setelah login.
-   [ ] Data siswa tampil secara dinamis.
-   [ ] Mata pelajaran aktif tampil.
-   [ ] Progress course tampil.
-   [ ] Upcoming assignment tampil.
-   [ ] Deadline/overdue state tampil.
-   [ ] Calendar mini tersedia.
-   [ ] Full calendar dapat digunakan.
-   [ ] Jadwal hari ini tersedia.
-   [ ] Nilai terbaru tersedia.
-   [ ] Announcement tersedia.
-   [ ] Notification tersedia.
-   [ ] Continue learning tersedia.
-   [ ] Empty states tersedia.
-   [ ] Loading states tersedia.
-   [ ] Error states tersedia.
-   [ ] Responsive desktop/tablet/mobile.
-   [ ] Keyboard accessible.
-   [ ] Permission Moodle dihormati.
-   [ ] Tidak ada mock data production.
-   [ ] Tidak merusak route/dashboard role lain.
-   [ ] Existing component/design system repository digunakan kembali.
-   [ ] Build/lint/typecheck/test project tetap berhasil.

------------------------------------------------------------------------

# 37. Implementation Priority

Implementasi dilakukan bertahap.

## Phase 1 --- Core Dashboard

1.  Layout
2.  Header
3.  Sidebar
4.  Greeting
5.  Summary cards
6.  Courses
7.  Upcoming deadlines

## Phase 2 --- Academic Tools

1.  Calendar
2.  Today's schedule
3.  Continue learning
4.  Grades
5.  Progress

## Phase 3 --- Communication

1.  Announcements
2.  Notifications
3.  Recent activity
4.  Messages integration

## Phase 4 --- Quality

1.  Responsive
2.  Accessibility
3.  Loading states
4.  Error states
5.  Performance
6.  Tests

------------------------------------------------------------------------

# 38. Suggested Final Desktop Layout

``` text
┌──────────────────────────────────────────────────────────────────────────────┐
│ LOGO       Search...                         🔔  💬  ?     Student ▾         │
├──────────────┬─────────────────────────────────────────────┬─────────────────┤
│              │                                             │                 │
│ Dashboard    │ Selamat pagi, Student 👋                   │   October 2026  │
│              │ Berikut aktivitas belajar kamu hari ini.   │   MINI CALENDAR │
│ Courses      │                                             │                 │
│ Calendar     │ ┌───────┐ ┌───────┐ ┌───────┐ ┌───────┐   │                 │
│ Tasks        │ │ 12    │ │ 5     │ │ 2     │ │ 78%   │   │ Upcoming        │
│ Grades       │ │Course │ │Tasks  │ │Due    │ │Progress│   │ Deadlines       │
│ Messages     │ └───────┘ └───────┘ └───────┘ └───────┘   │                 │
│              │                                             │                 │
│ Notifications│ Mata pelajaran Saya                        │ Jadwal Hari Ini │
│              │ ┌────────────┐ ┌────────────┐              │                 │
│ ───────────  │ │ Course A   │ │ Course B   │              │                 │
│ Profile      │ │ Progress   │ │ Progress   │              │                 │
│ Settings     │ └────────────┘ └────────────┘              │                 │
│              │                                             │                 │
│ Logout       │ Tugas & Deadline                            │ Nilai Terbaru   │
│              │ ┌──────────────────────────────────────┐   │                 │
│              │ │ Assignment / Quiz / Exam             │   │                 │
│              │ └──────────────────────────────────────┘   │                 │
│              │                                             │                 │
│              │ Pengumuman                                  │                 │
│              │ Recent Activity                             │                 │
└──────────────┴─────────────────────────────────────────────┴─────────────────┘
```

------------------------------------------------------------------------

# 39. UX Goal

Dashboard bukan sekadar halaman statistik.

Ketika siswa membuka dashboard, dalam **5--10 detik** mereka harus dapat
menjawab:

> **Apa yang harus saya kerjakan sekarang, kapan deadline-nya, dan dari
> mana saya harus mulai?**

Karena itu prioritas visual adalah:

**Urgent tasks → Today's schedule → Continue learning → Courses →
Calendar → Grades → Announcements → Activity**

------------------------------------------------------------------------

# 40. Implementation Note

Sebelum coding:

1.  Audit struktur `development`.
2.  Identifikasi framework, routing, component library, styling system,
    authentication, dan data-fetching pattern.
3.  Identifikasi dashboard existing dan role-based access.
4.  Reuse component/token yang sudah tersedia.
5.  Identifikasi endpoint Moodle yang sudah digunakan.
6.  Implement dashboard secara incremental.
7.  Jangan mengubah kontrak API existing tanpa kebutuhan.
8.  Jangan membuat mock API permanen.
9.  Pastikan role siswa tidak mempengaruhi dashboard admin/guru.
10. Setelah implementasi, jalankan lint, typecheck, build, dan test yang
    tersedia.
