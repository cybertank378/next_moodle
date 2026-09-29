## 🎯 Issue Title
`feat({domain}): Implement [{feature_name}] Section with Responsive UI & Dark/Light Theme`

---

### 📌 Description
Membuat/mengorganisasi fitur `[{feature_name}]` menggunakan **Atomic Architecture** pada `src/sections/{feature}/`, terintegrasi dengan `src/shared-ui/component`, serta mendukung **Responsive Mobile-First Design**, **Dark & Light Theme**, dan **Modern UI/UX Standards**.

---

### 📂 Target Paths Checklist

- [ ] `src/sections/{feature}/atoms/`
- [ ] `src/sections/{feature}/molecules/`
- [ ] `src/sections/{feature}/organisms/`
- [ ] `src/sections/{feature}/pages/{feature}Sections.tsx`
- [ ] `src/app/{route-path}/page.tsx`

---

### 🎨 Styling & Design Requirements

#### 📱 1. Mobile-First & Responsive Standards
- [ ] **Breakpoint Flow:** Gunakan Tailwind breakpoint secara mendasar (Mobile baseline -> `sm:` -> `md:` -> `lg:` -> `xl:`).
- [ ] **Layout Adaptability:**
  - Mobile (`< 640px`): Single column layout (`flex-col`, `grid-cols-1`), full-width buttons/cards.
  - Tablet (`640px - 1024px`): 2-column grid (`md:grid-cols-2`), collapsible sidebar/filters.
  - Desktop (`> 1024px`): Multi-column layout (`lg:grid-cols-3` / `lg:grid-cols-12`).
- [ ] **Touch Targets:** Elemen interaktif (button, input, icon toggle) pada layar mobile memiliki min-height/padding yang nyaman untuk sentuhan jari (minimal `44x44px` area sentuh).
- [ ] **Overflow & Scrolling:** Pastikan tabel/data besar menggunakan horizontal scroll wrapper (`overflow-x-auto`) pada layar mobile.

#### 🌓 2. Dark & Light Theme Integration
- [ ] **Semantic Color Tokens:** Menggunakan CSS Variable / Semantic Classes dari Design System (misal: `bg-background`, `text-foreground`, `border-border`, `bg-card`).
- [ ] **Explicit Dark Classes:** Jika menggunakan Tailwind `dark:` prefix, wajib menyediakan alternatif untuk kedua mode:
  - Background: `bg-white dark:bg-zinc-900` / `bg-slate-50 dark:bg-zinc-950`
  - Text Primary: `text-zinc-900 dark:text-zinc-50`
  - Text Muted: `text-zinc-500 dark:text-zinc-400`
  - Border: `border-zinc-200 dark:border-zinc-800`
- [ ] **Contrast & Accessibility:** Kontras teks dan background memenuhi kriteria WCAG AA di kedua mode.

#### ✨ 3. Modern Aesthetic Guidelines
- [ ] **Spacing & Hierarchy:** Konsistensi penggunaan gap/padding (`gap-4 md:gap-6`, `p-4 md:p-6`).
- [ ] **Visual Accents:** Radius sudut modern (`rounded-lg` / `rounded-xl`), soft border (`border border-zinc-200/80 dark:border-zinc-800/80`), dan subtle shadow (`shadow-sm hover:shadow-md`).
- [ ] **Micro-Interactions:** Smooth transition untuk state hover, focus, dan theme change (`transition-colors duration-200`, `focus-visible:ring-2`).

---

### 📋 Technical Tasks & Deliverables

#### 1. Atoms Layer (`src/sections/{feature}/atoms/`)
> *Atoms:* Reusable atomic wrapper dari `src/shared-ui/component` yang mendukung theme.

- [ ] Buat `{feature}Badge.tsx` (Support dark/light theme variant)
- [ ] Buat `{feature}IconButton.tsx` (Mobile-friendly touch area + hover effect)
- [ ] *Kriteria:* Pure Presentational, responsif terhadap parent container.

#### 2. Molecules Layer (`src/sections/{feature}/molecules/`)
> *Molecules:* Kombinasi Atoms dengan susunan layout fleksibel (Flex/Grid).

- [ ] Buat `{feature}CardHeader.tsx` (Flex `flex-col sm:flex-row` untuk adaptasi mobile)
- [ ] Buat `{feature}FilterBar.tsx` (Responsive search bar & filter drawer/dropdown)
- [ ] *Kriteria:* Menerima `props` & `callbacks`, tanpa *direct API fetching*.

#### 3. Organisms Layer (`src/sections/{feature}/organisms/`)
> *Organisms:* Menggabungkan Molecules + Business Logic / API Hooks + State Management.

- [ ] Buat API Hook spesifik (`use{Feature}Data.ts`)
- [ ] Buat `{feature}TableOrganism.tsx` (Mobile card list view / responsive table scroll)
- [ ] Buat `{feature}FormOrganism.tsx` (Form layout responsif 1-column pada mobile, 2-column pada desktop)
- [ ] *Kriteria:* Menangani loading skeleton responsif, error state, dan API mutation.

#### 4. Sections / Pages Layer (`src/sections/{feature}/pages/`)
> *Feature Layout Layer:* Menyusun tata letak utama seluruh Organisms.

- [ ] Buat `src/sections/{feature}/pages/{feature}Sections.tsx`
- [ ] Bungkus layout dengan container responsif (`w-full max-w-7xl mx-auto p-4 md:p-6 lg:p-8 space-y-6`).

#### 5. App Router Page Entry (`src/app/{route-path}/page.tsx`)
- [ ] Export Next.js Metadata & panggil `<{feature}Sections />`.

---

### 🧪 Acceptance Criteria
1. Tampilan **bebas dari horizontal overflow / broken layout** pada ukuran breakpoint:
   - Mobile: `375px` & `414px`
   - Tablet: `768px`
   - Desktop: `1280px` & `1440px`
2. Tampilan teruji dan terlihat bersih pada **Light Mode** dan **Dark Mode** tanpa teks mati/hilang kontras.
3. Selalu menggunakan komponen dari `src/shared-ui/component` sebagai pondasi utama UI.