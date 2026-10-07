# [Editor] Integrasi equation LaTeX pada RichTextEditor, viewer, dan bank soal

## Target
Repository: https://github.com/cybertank378/next_moodle
Branch implementasi: development

## Masalah dan temuan audit
- package.json menggunakan @tiptap/react, @tiptap/pm, dan @tiptap/starter-kit ^3.31.4; Mathematics dan KaTeX belum terdaftar.
- src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts hanya mendaftarkan StarterKit.
- RichTextEditor.tsx mengirim onChange({ json, text, html }) dan memakai immediatelyRender: false.
- RichTextEditorToolbar.tsx belum menyediakan tombol rumus.
- RichTextViewer.tsx memakai NotificationContentRenderer untuk JSON. Renderer tersebut belum menangani inlineMath/blockMath; node tanpa children berpotensi hilang. String HTML diteruskan langsung ke dangerouslySetInnerHTML dan perlu masuk jalur sanitasi yang tepat.
- src/sections/questions/organisms/QuestionEditor.tsx mempunyai editor sendiri dengan extensions: [StarterKit], menyimpan editor.getHTML() ke questionText, dan memakai useQuestionApi. Menambah extension pada editor bersama saja belum mengaktifkan equation pada bank soal.

## Tujuan
Dukung rumus inline dan block dalam editor, penyisipan/pengeditan melalui modal dengan preview, serta render yang konsisten setelah save/reload. Integrasikan pada bank soal melalui komponen bersama dan pertahankan kontrak API Moodle yang menerima questionText berupa HTML.

## File implementasi
| File existing | Perubahan |
| --- | --- |
| package.json dan package-lock.json | Tambahkan Mathematics versi kompatibel dengan Tiptap 3 yang dipakai, KaTeX, dan tipe bila dibutuhkan |
| src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts | Daftarkan Mathematics dan callback pembuka modal |
| src/shared-ui/component/RichTextEditor/RichTextEditor.tsx | Kelola modal, selection/posisi, insert/update/delete, dan guard readOnly/disabled |
| src/shared-ui/component/RichTextEditor/RichTextEditorToolbar.tsx | Tombol Rumus dengan shared Button |
| src/shared-ui/component/RichTextEditor/RichTextEditorTypes.ts | Tambahkan tipe math modal/config bila diperlukan; jangan memutus kontrak onChange |
| src/shared-ui/component/RichTextEditor/RichTextEditorField.tsx | Pertahankan wrapper field dan teruskan konfigurasi bila ditambahkan |
| src/shared-ui/component/RichTextEditor/RichTextViewer.tsx | Render rumus dari JSON maupun HTML tersanitasi |
| src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts | Tangani node matematika atau delegasikan ke renderer bersama; pertahankan plain text rumus |
| src/sections/questions/organisms/QuestionEditor.tsx | Ganti editor lokal dengan RichTextEditorField, tetap gunakan useQuestionApi |
| Layout/global CSS yang berlaku | Import stylesheet KaTeX sekali untuk editor dan viewer |

Tambahkan komponen modal equation dan renderer/helper bersama mengikuti konvensi folder project. Hindari barrel export dan duplikasi konfigurasi antara editor/preview/viewer.

## Langkah teknis
### 1. Dependencies
Contoh versi extension diselaraskan dengan versi minimum Tiptap existing:
~~~bash
npm install @tiptap/extension-mathematics@^3.31.4 katex
~~~
Verifikasi kompatibilitas paket dan peer dependency sebelum mengunci lockfile. Jangan meng-upgrade semua paket Tiptap tanpa kebutuhan.

Import CSS pada entry global yang berlaku:
~~~ts
import "katex/dist/katex.min.css";
~~~

### 2. Extension
Tambahkan Mathematics ke array existing; pertahankan konfigurasi StarterKit:
~~~ts
import { Mathematics } from "@tiptap/extension-mathematics";

// Di getRichTextEditorExtensions:
Mathematics.configure({
  katexOptions: {
    throwOnError: false,
    trust: false,
  },
});
~~~
Ini cuplikan konfigurasi, bukan pengganti lengkap fungsi existing. Tambahkan inlineOptions.onClick dan blockOptions.onClick untuk membuka modal dengan node.attrs.latex, jenis node, dan posisi. Jangan menggunakan window.prompt untuk UI final.

### 3. Modal dan operasi editor
- Tombol “Rumus” membuka modal dengan pilihan Inline/Block, input LaTeX, contoh rumus, preview, Simpan, Batal, dan Hapus ketika mengedit.
- Gunakan shared Modal, Button, TextAreaField/field yang tersedia.
- Simpan selection sebelum fokus berpindah ke modal; pulihkan ketika menyisipkan. Untuk update/delete gunakan posisi node yang diklik dan validasi node masih sesuai. Tutup/invalidate state jika dokumen diganti.
- Validasi rumus nonkosong dan parse menggunakan KaTeX sebelum menyimpan; preview boleh toleran, tetapi LaTeX invalid tidak boleh disimpan diam-diam. Render error sebagai pesan field.
- Semua aksi mutasi diblokir ketika disabled/readOnly, termasuk callback klik rumus.
- Pertahankan undo/redo, focus, external value sync, dan immediatelyRender: false.

Contoh command setelah extension didaftarkan:
~~~ts
editor.chain().focus().insertInlineMath({ latex: "\\frac{a}{b}" }).run();
editor.chain().focus().insertBlockMath({ latex: "x^2 + y^2 = z^2" }).run();

// pos berasal dari callback klik node, bukan angka dummy:
editor.chain().focus().updateInlineMath({ latex, pos }).run();
editor.chain().focus().updateBlockMath({ latex, pos }).run();
editor.chain().focus().deleteInlineMath({ pos }).run();
editor.chain().focus().deleteBlockMath({ pos }).run();
~~~

### 4. Penyimpanan dan viewer
- Untuk konten bersama, pertahankan JSON Tiptap dan attrs.latex pada inlineMath/blockMath sebagai data editable; jangan menyimpan hanya markup visual KaTeX.
- getHTML() tidak boleh diasumsikan sudah berisi hasil visual KaTeX lengkap. Viewer harus membaca marker matematika lalu merender LaTeX dengan KaTeX atau memakai renderer read-only yang mengenali extension tersebut.
- Renderer JSON harus menangani kedua node secara eksplisit. Plain text harus menyertakan LaTeX agar dokumen rumus-only tidak dianggap kosong.
- Sanitasi HTML input pada batas yang sesuai; pertahankan marker/atribut matematika yang diperlukan dan cegah script/event handler/URL berbahaya. Gunakan trust: false.
- Audit validator “konten kosong”, batas panjang, preview notifikasi, dan consumer lain sehingga node rumus tidak terbuang.
- Bank soal tetap mengirim questionText HTML sesuai DTO existing. Pastikan HTML melalui backend/Moodle tetap mempertahankan rumus saat dibaca ulang.
- Tentukan renderer Moodle yang tersedia: filter matematika + delimiter yang didukung, atau format portable yang telah diverifikasi. Jangan menganggap Moodle memahami data-type/data-latex milik Tiptap. Bila perlu gunakan serializer khusus pada boundary Moodle, tetap pertahankan LaTeX editable dan konversi balik yang jelas.
- Tidak perlu membuat tabel/endpoint baru hanya untuk menyimpan equation.

### 5. Penggunaan pada QuestionEditor
Setelah fitur selesai, gunakan komponen bersama menggantikan useEditor/EditorContent/toolbar lokal:
~~~tsx
import RichTextEditorField from "@/shared-ui/component/RichTextEditor/RichTextEditorField";

<RichTextEditorField
  label="Isi Soal"
  value={formData.questionText}
  disabled={loading}
  onChange={({ html }) =>
    setFormData((previous) => ({
      ...previous,
      questionText: html,
    }))
  }
/>
~~~
Pertahankan createQuestion/updateQuestion dari useQuestionApi dan validasi form yang sudah ada. Cuplikan ini menunjukkan kontrak penggunaan existing setelah dukungan equation diterapkan; fitur belum tersedia di branch pada saat audit.

## Cara penggunaan bagi pengguna
1. Buka form bank soal dan letakkan kursor di lokasi rumus.
2. Klik tombol Rumus.
3. Pilih Inline untuk rumus di tengah kalimat atau Block untuk rumus pada baris tersendiri.
4. Masukkan LaTeX tanpa delimiter $/$$ di modal, lihat preview, lalu klik Simpan.
5. Klik rumus existing untuk mengedit atau menghapusnya.
6. Simpan soal dan buka ulang untuk memastikan rumus tetap tampil.

| Kebutuhan | Ketik di input modal |
| --- | --- |
| Pecahan | \frac{a}{b} |
| Akar | \sqrt{25} |
| Pangkat | x^2 + y^2 |
| Indeks | a_n |
| Persamaan | 2x + 5 = 15 |
| Rumus kuadrat | x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a} |

Dalam input UI cukup satu backslash; dalam literal string JavaScript perlu \\.
Auto-conversion $...$/$$...$$ di konten lama bukan syarat fitur ini; jika ditambahkan, migrasi harus terencana agar teks biasa tidak berubah tanpa sengaja.

## Acceptance criteria
- [ ] Rumus inline/block dapat dibuat, diedit, dihapus, serta undo/redo melalui editor bersama.
- [ ] Modal memakai shared UI, preview, contoh, validasi, serta focus management.
- [ ] ReadOnly/disabled tidak memungkinkan mutasi equation.
- [ ] QuestionEditor menggunakan komponen bersama dan useQuestionApi existing.
- [ ] JSON/HTML save-reload mempertahankan LaTeX dan tipe rumus.
- [ ] RichTextViewer dan consumer konten terkait menampilkan rumus tanpa kehilangan node.
- [ ] Integrasi Moodle dibuktikan dengan save-fetch-edit ulang dan tampilan peserta; tidak hanya preview lokal.
- [ ] Soal yang hanya berisi rumus tidak dianggap kosong.
- [ ] Konten lama, format teks, dan API existing tetap berfungsi.
- [ ] Mobile tidak overflow halaman; equation panjang dapat scroll dalam area konten.
- [ ] Warna rumus dan error terbaca pada tema yang didukung.
- [ ] HTML berbahaya tidak dieksekusi; LaTeX invalid memberi pesan yang jelas.
- [ ] Tidak ada hydration warning, loop onChange, atau reset selection yang mengganggu.

## Validasi
Tes perilaku yang relevan: roundtrip JSON/HTML, render inline/block, konten rumus-only, invalid LaTeX, guard disabled/readOnly, edit posisi node, sanitasi HTML, dan regresi renderer existing. Tambahkan coverage pada RichTextViewer.test.tsx dan renderer/helper yang berubah.
~~~bash
npm run typecheck
npm run lint
npm run lint:barrel
npm run test
npm run build
~~~
Lampirkan screenshot modal/preview/viewer, hasil pemeriksaan, dan bukti roundtrip Moodle. Jangan menyatakan pemeriksaan lulus sebelum dijalankan.

## Referensi resmi
https://tiptap.dev/docs/editor/extensions/nodes/mathematics
https://katex.org/docs/options.html

## Saran commit
feat(editor): support inline and block math equations across editor and viewer

