## Description
This PR decouples the KaTeX math equation rendering, HTML sanitization, and plain text extraction from `modules/notification` into a shared UI utility under `src/shared-ui/component/RichTextEditor/richTextRenderer.ts`.

### Architecture Improvements
1. **Shared HTML & KaTeX Renderer:**
   - Created `RichTextRenderer` class and `richTextRenderer` singleton in `src/shared-ui/component/RichTextEditor/richTextRenderer.ts`.
   - Centralizes KaTeX equation rendering (`inlineMath` and `blockMath`), XSS sanitization (stripping `<script>`, `<iframe>`, event handlers, unsafe protocols), and text extraction.
2. **Decoupled RichText Components:**
   - `RichTextViewer` now consumes `richTextRenderer` directly with full SSR compatibility and safe KaTeX formatting, eliminating cross-module imports from `modules/notification`.
   - `RichTextEditor` uses `richTextRenderer.extractPlainText()` and strongly-typed math click callbacks without any dependency on notification infrastructure.
3. **Notification Module Integration:**
   - `NotificationContentRenderer` extends `RichTextRenderer` and implements `NotificationContentRendererInterface`, preserving 100% backward compatibility for all existing notification campaign use cases and tests.

### Quality & Verification
- **Zero `any`:** Absolutely zero `any` across all modified and new files.
- **File Headers:** Every file starts with `// Files: <path>`.
- **Barrel Exports:** `npm run lint:barrel` passed (0 violations).
- **TypeScript:** `npm run typecheck` passed (0 errors).
- **Biome:** Formatted and validated.
- **Tests:** All 18 test files (134 tests) passed in Vitest.
- **Build:** `npm run build` completed successfully.
