## 🎯 Issue Title
`feat({domain}): Implement Atomic Sections and Route Page for [{feature_name}]`

---

### 📌 Description
Membuat/mengorganisasi fitur `[{feature_name}]` menggunakan **Atomic Architecture** pada folder `src/sections/{feature}/` yang mengonsumsi UI Primitive dari `src/shared-ui/component`, serta mendaftarkan lokasinya pada App Router (`src/app/`).

---

### 📂 Target Paths Checklist

- [ ] `src/sections/{feature}/atoms/`
- [ ] `src/sections/{feature}/molecules/`
- [ ] `src/sections/{feature}/organisms/`
- [ ] `src/sections/{feature}/pages/{feature}Sections.tsx`
- [ ] `src/app/{route-path}/page.tsx`

---

### 📋 Technical Tasks & Deliverables

#### 1. Atoms Layer (`src/sections/{feature}/atoms/`)
> *Atoms:* Elemen UI terkecil dan paling spesifik untuk fitur `{feature}`. Harus selalu mengimpor atau membungkus dasar dari `src/shared-ui/component`.

- [ ] Buat `{feature}Badge.tsx` (wrapper `shared-ui/component/Badge`)
- [ ] Buat `{feature}InputField.tsx` (wrapper `shared-ui/component/Input`)
- [ ] Buat `{feature}SubmitButton.tsx` (wrapper `shared-ui/component/Button`)
- [ ] *Kriteria:* Pure Presentational Component (Bebas dari state global, API call, atau business logic).

#### 2. Molecules Layer (`src/sections/{feature}/molecules/`)
> *Molecules:* Penggabungan beberapa **Atoms** menjadi satu unit UI fungsional sederhana.

- [ ] Buat `{feature}FormGroup.tsx` (Kombinasi Label + Input Atom + Error Text)
- [ ] Buat `{feature}CardHeader.tsx` (Kombinasi Title + Badge Atom)
- [ ] Buat `{feature}FilterRow.tsx` (Kombinasi Search Input + Filter Dropdown)
- [ ] *Kriteria:* Menerima `props` & `event handlers` (callback), tidak melakukan *direct API fetching*.

#### 3. Organisms Layer (`src/sections/{feature}/organisms/`)
> *Organisms:* Mengintegrasikan **Molecules** dengan bisnis logika, API Hooks (`useQuery` / `useMutation`), dan Form / State Management.

- [ ] Buat API Hooks spesifik: `use{Feature}Data.ts` / `useMutate{Feature}.ts`
- [ ] Buat `{feature}FormOrganism.tsx` (Molecules + Validation/Hook Form + Submit Mutation)
- [ ] Buat `{feature}ListOrganism.tsx` (Molecules + API Fetching + Loading/Error State)
- [ ] *Kriteria:* Mengurus error handling, loading indicator, dan mapping data dari/ke API.

#### 4. Sections / Pages Layer (`src/sections/{feature}/pages/`)
> *Feature Layout Layer:* Menyusun tata letak layout dari **Organisms** untuk kebutuhan tampilan utama fitur.

- [ ] Buat `src/sections/{feature}/pages/{feature}Sections.tsx`
- [ ] Susun layout (Grid/Flex layout) yang memanggil Organisms terkait (misal: Form Organism & List Organism).

#### 5. App Router Page Entry (`src/app/path-to-feature/page.tsx`)
> *App Router Shell:* Pintu masuk rute Next.js.

- [ ] Buat file `page.tsx` di rute yang sesuai (misal: `src/app/(protected)/{feature}/page.tsx` atau `src/app/(auth)/login/page.tsx`)
- [ ] Tambahkan Next.js Metadata (Title, Description) jika diperlukan.
- [ ] Import dan panggil `<{feature}Sections />`.

---

### 🧪 Acceptance Criteria & Rules
1. **Shared UI Usage:** Selalu utamakan mengimpor UI dasar dari `src/shared-ui/component`.
2. **Separation of Concerns:**
   - `src/app/.../page.tsx` murni sebagai Route Entry / Metadata Provider.
   - `src/sections/{feature}/pages/` mengatur tata letak visual (Layout & Container).
   - `Organisms` menangani integrasi API & State.
   - `Atoms & Molecules` murni komponen presentasional (*Props in, UI out*).
3. **No Direct Logic in App Router:** Jangan membuat API Fetching atau State Management langsung di `src/app/.../page.tsx`.