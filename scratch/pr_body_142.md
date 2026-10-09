## Description
Resolves #142

This PR integrates inline and block LaTeX math equations across Tiptap `RichTextEditor`, `RichTextViewer`, content renderers, and question bank (`QuestionEditor`).

### Key Changes
1. **Dependencies & Styles:**
   - Added `@tiptap/extension-mathematics` and `katex` (along with `@types/katex`).
   - Imported `katex/dist/katex.min.css` in [src/app/layout.tsx](file:///d:/Project/Website/next-moodle/src/app/layout.tsx) for consistent formula typography across all screens.

2. **Mathematics Extension:**
   - Configured `Mathematics` extension in [src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts](file:///d:/Project/Website/next-moodle/src/shared-ui/component/RichTextEditor/richTextEditorExtensions.ts) with `throwOnError: false, trust: false`.
   - Wired `inlineOptions.onClick` and `blockOptions.onClick` handlers to trigger interactive editing.

3. **Formula Modal Component:**
   - Created [src/shared-ui/component/RichTextEditor/RichTextMathModal.tsx](file:///d:/Project/Website/next-moodle/src/shared-ui/component/RichTextEditor/RichTextMathModal.tsx) using atomic UI components (`Modal`, `Button`, `TextAreaField`).
   - Supports Inline vs Block segmented selection, quick formula example chips (fraction, square root, power, index, quadratic equation), live KaTeX preview with horizontal scroll, and syntax validation preventing invalid LaTeX saves.

4. **Editor Operations & Toolbar:**
   - Added formula button with `Sigma` icon in [src/shared-ui/component/RichTextEditor/RichTextEditorToolbar.tsx](file:///d:/Project/Website/next-moodle/src/shared-ui/component/RichTextEditor/RichTextEditorToolbar.tsx).
   - In [src/shared-ui/component/RichTextEditor/RichTextEditor.tsx](file:///d:/Project/Website/next-moodle/src/shared-ui/component/RichTextEditor/RichTextEditor.tsx): managed selection restoration before opening modal, insert/update/delete operations, and disabled/readOnly mutation guards.

5. **Sanitization, Plain Text Extraction & Viewers:**
   - In [src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts](file:///d:/Project/Website/next-moodle/src/modules/notification/infrastructure/providers/NotificationContentRenderer.ts):
     - Explicitly rendered `inlineMath` and `blockMath` nodes with responsive `overflow-x-auto` wrappers.
     - Extracted LaTeX formulas in `extractPlainText` so equation-only content is not flagged as empty.
     - Added `renderHtmlWithMath` to parse math markers from HTML strings while sanitizing malicious scripts/event handlers.
   - Updated [src/shared-ui/component/RichTextEditor/RichTextViewer.tsx](file:///d:/Project/Website/next-moodle/src/shared-ui/component/RichTextEditor/RichTextViewer.tsx) to render equations safely for both JSON documents and HTML strings.

6. **Question Bank Integration:**
   - Verified [src/sections/questions/organisms/QuestionEditor.tsx](file:///d:/Project/Website/next-moodle/src/sections/questions/organisms/QuestionEditor.tsx) handles math equations properly and cleaned up legacy implicit `any` usages.

### Quality & Invariants Verification
- **Zero `any` Rule:** ABSOLUTELY ZERO `any` across all modified/new files.
- **File Header Rule:** Line 1 of all created/modified files begins with `// Files: <path>`.
- **Barrel Exports:** `npm run lint:barrel` passed with 0 violations.
- **Typecheck:** `npm run typecheck` passed with 0 errors.
- **Biome Lint:** Checked files passed with 0 errors and 0 warnings.
- **Tests:** All 25 related unit and integration tests passed.
- **Build:** `npm run build` compiled all 52 routes successfully.
