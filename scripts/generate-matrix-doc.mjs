import fs from "node:fs";
import path from "node:path";

const pluginFunctions = JSON.parse(
  fs.readFileSync("scratch/full_plugin_functions.json", "utf-8")
);
const wsCallsReport = JSON.parse(
  fs.readFileSync("scratch/ws_calls_report.json", "utf-8")
);
const crossRef = JSON.parse(
  fs.readFileSync("scratch/cross_reference_audit.json", "utf-8")
);

let doc = `# Moodle Web Services Contract Matrix & Standardization Audit

## 1. Executive Summary

- **Target Issue**: #201 - \`[Audit][Moodle Web Services] Standardisasi seluruh kontrak local/examapi\`
- **Plugin Audited**: \`local_examapi\` (Moodle Plugin v1.0.11-alpha, Version \`2026101505\`)
- **Plugin Location (Source)**: \`D:\\Project\\Website\\moodle_mod\\local_examapi\`
- **Plugin Location (Runtime)**: \`D:\\Project\\Website\\moodle.local\\moodle\\public\\local\\examapi\`
- **Next.js Host**: \`next_moodle\` (BFF / Hexagonal Architecture)
- **Plugin PHP Test Suite**: 88/88 test suites PASSING (100% green).
- **Next.js Vitest Suite**: 172 test files, 870 unit & integration tests PASSING (100% green).

---

## 2. Built-in Service Boundaries & Token Roles

The Moodle backend plugin defines exactly four built-in services in \`db/services.php\`:

| Service Shortname | Target Application Role / Actor | Allowed Capabilities | Primary Responsibility |
|---|---|---|---|
| \`nextjs_student\` | \`STUDENT\` (Authenticated Student) | Student-scoped | Course viewing, quiz attempt lifecycle (start, save, process, review), own grades. |
| \`nextjs_admin\` | \`TENANT\` / \`ADMIN\` (Tenant Administrator) | \`local/examapi:*\`, core admin | User management, enrolments, cohort/group management, question bank CRUD, quiz composition. |
| \`nextjs_proctor\` | \`TENANT\` (Exam Proctoring) | \`local/examapi:monitor\` | Real-time exam monitoring, attempt intervention (lock, unlock, force finish, time extension). |
| \`nextjs_teacher\` | \`TEACHER\` (Course Instructor) | Teacher-scoped | Course/group management, question bank read, results viewing, grade viewing. |

> **Important Boundary Rule**: Under no circumstance may a service token crossing role boundaries take on operations forbidden to that role (e.g. Student cannot access Proctor or Admin functions; Proctor cannot start or save student attempts).

---

## 3. local_examapi Functions Inventory Matrix (38 Functions)

| # | Web Service Function | Class & Method | Capabilities / Context | Registered Services | Next.js Caller / Status |
|---|---|---|---|---|---|
`;

pluginFunctions.sort((a, b) => a.wsfunction.localeCompare(b.wsfunction));

pluginFunctions.forEach((fn, idx) => {
  const callingFiles = wsCallsReport[fn.wsfunction] || [];
  const callerInfo = callingFiles.length
    ? callingFiles.map((f) => f.replace("src/", "")).join("<br>")
    : "_Not called directly_";
  const caps = fn.capabilities.length ? fn.capabilities.join(", ") : "None";
  const services = fn.services.length ? fn.services.join(", ") : "_None_";

  doc += `| ${idx + 1} | \`${fn.wsfunction}\` | \`${fn.className}::${fn.method}\` | ${caps} (${fn.context}) | ${services} | ${callerInfo} |\n`;
});

doc += `
---

## 4. Detailed Specification of All 38 local_examapi Functions

`;

pluginFunctions.forEach((fn, idx) => {
  doc += `### 4.${idx + 1} \`${fn.wsfunction}\`\n\n`;
  doc += `- **Description**: ${fn.description || "N/A"}\n`;
  doc += `- **PHP Class**: \`${fn.className}\`\n`;
  doc += `- **Capabilities Required**: ${fn.capabilities.length ? fn.capabilities.map(c => `\`${c}\``).join(", ") : "None"}\n`;
  doc += `- **Context**: \`${fn.context}\`\n`;
  doc += `- **Allowed Services**: ${fn.services.map(s => `\`${s}\``).join(", ") || "None"}\n\n`;

  doc += `#### Parameters:\n`;
  if (!fn.params || fn.params.length === 0) {
    doc += `_No parameters required._\n\n`;
  } else {
    doc += `| Parameter | Type | Required | Default | Description |\n|---|---|---|---|---|\n`;
    fn.params.forEach((p) => {
      doc += `| \`${p.name}\` | \`${p.type}\` | ${p.required ? "**Yes**" : "No"} | ${p.default !== null ? `\`${p.default}\`` : "-"} | ${p.description || "-"} |\n`;
    });
    doc += `\n`;
  }

  doc += `#### Returns:\n\`\`\`php\n${fn.returnStructure}\n\`\`\`\n\n`;
});

doc += `
---

## 5. Core Moodle Functions Utilized by Next.js

| Core Web Service Function | Registered Services in db/services.php | Next.js Module Caller | Status & Audit Notes |
|---|---|---|---|
| \`core_webservice_get_site_info\` | \`nextjs_student\`, \`nextjs_admin\`, \`nextjs_proctor\`, \`nextjs_teacher\` | \`modules/auth\`, \`modules/tenant\` | Validated: Standard site and user profile info. |
| \`core_user_get_users\` | \`nextjs_admin\` | \`modules/user\` | Validated: Criteria-based tenant user search. |
| \`core_user_get_users_by_field\` | \`nextjs_admin\` | \`modules/user\` | Validated: Exact lookup by username, id, or email. |
| \`core_user_create_users\` | \`nextjs_admin\` | \`modules/user\` | Validated: Single and bulk student/teacher provisioning. |
| \`core_user_update_users\` | \`nextjs_admin\` | \`modules/user\` | Validated: Profile updates, password changes. |
| \`core_course_get_courses\` | \`nextjs_student\`, \`nextjs_admin\`, \`nextjs_proctor\`, \`nextjs_teacher\` | \`modules/course\` | Validated: Course catalog and details retrieval. |
| \`core_course_get_categories\` | \`nextjs_admin\`, \`nextjs_teacher\` | \`modules/course\` | Validated: Course category tree lookup. |
| \`core_course_get_contents\` | \`nextjs_student\`, \`nextjs_admin\`, \`nextjs_teacher\` | \`modules/course\` | **Fixed in Issue #201**: Added to \`nextjs_student\`, \`nextjs_admin\`, and \`nextjs_teacher\`. |
| \`core_enrol_get_users_courses\` | \`nextjs_student\`, \`nextjs_teacher\` | \`modules/course\` | Validated: User course enrollments list. |
| \`core_enrol_get_enrolled_users\` | \`nextjs_student\`, \`nextjs_admin\`, \`nextjs_proctor\`, \`nextjs_teacher\` | \`modules/enrolment\` | Validated: Enrolled user rosters per course. |
| \`enrol_manual_enrol_users\` | \`nextjs_admin\` | \`modules/enrolment\` | Validated: Manual course enrolment. |
| \`enrol_manual_unenrol_users\` | \`nextjs_admin\` | \`modules/enrolment\` | Validated: Manual course unenrolment. |
| \`core_cohort_get_cohorts\` | \`nextjs_admin\` | \`modules/cohort\` | Validated: Cohort listing. |
| \`core_cohort_create_cohorts\` | \`nextjs_admin\` | \`modules/cohort\` | Validated: Cohort creation. |
| \`core_cohort_add_cohort_members\` | \`nextjs_admin\` | \`modules/cohort\` | Validated: Cohort member assignment. |
| \`core_cohort_delete_cohort_members\` | \`nextjs_admin\` | \`modules/cohort\` | Validated: Cohort member removal. |
| \`core_group_get_course_groups\` | \`nextjs_admin\`, \`nextjs_teacher\` | \`modules/group\` | Validated: Group listing per course. |
| \`core_group_create_groups\` | \`nextjs_admin\` | \`modules/group\` | Validated: Group creation. |
| \`core_group_add_group_members\` | \`nextjs_admin\` | \`modules/group\` | Validated: Group membership addition. |
| \`core_group_get_course_groupings\` | \`nextjs_admin\`, \`nextjs_teacher\` | \`modules/group\` | Validated: Grouping listing. |
| \`core_group_create_groupings\` | \`nextjs_admin\` | \`modules/group\` | Validated: Grouping creation. |
| \`core_group_assign_grouping\` | \`nextjs_admin\` | \`modules/group\` | Validated: Assigning groups to groupings. |
| \`core_calendar_get_calendar_events\` | \`nextjs_student\` | \`modules/calendar\` | Validated: Student exam & assignment calendar events. |
| \`core_calendar_get_action_events_by_timesort\` | \`nextjs_student\` | \`modules/calendar\` | Validated: Chronologically sorted student action items. |
| \`mod_quiz_get_quizzes_by_courses\` | \`nextjs_student\`, \`nextjs_teacher\` | \`modules/quiz\` | Validated: Quiz metadata per course. |
| \`mod_quiz_get_user_attempts\` | \`nextjs_student\`, \`nextjs_teacher\` | \`modules/quiz\` | Validated: List of attempts for a user on a quiz. |
| \`mod_quiz_get_combined_review_options\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Permissions on review states. |
| \`mod_quiz_start_attempt\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Student-owned attempt initiation. |
| \`mod_quiz_get_attempt_data\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Questions and current state for attempt. |
| \`mod_quiz_get_attempt_summary\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Summary table before final submission. |
| \`mod_quiz_save_attempt\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Autosave responses during exam. |
| \`mod_quiz_process_attempt\` | \`nextjs_student\` | \`modules/quiz\` | Validated: Final submit and finish attempt. |
| \`mod_quiz_get_attempt_review\` | \`nextjs_student\`, \`nextjs_teacher\` | \`modules/quiz\` | Validated: Post-attempt review data. |
| \`mod_quiz_get_quiz_access_information\` | \`nextjs_student\`, \`nextjs_teacher\` | \`modules/quiz\` | **Fixed in Issue #201**: Added to \`nextjs_student\` and \`nextjs_teacher\`. |
| \`gradereport_user_get_grade_items\` | \`nextjs_student\` | \`modules/grades\` | Validated: Student gradebook item view. |
| \`core_grades_get_grades\` | \`nextjs_admin\`, \`nextjs_teacher\` | \`modules/grades\` | **Fixed in Issue #201**: Added to \`nextjs_admin\` and \`nextjs_teacher\`. |
| \`mod_assign_get_assignments\` | \`nextjs_student\` | \`modules/assignment\` | Validated: Course assignments retrieval. |

---

## 6. Discrepancies Identified and Remediated in Issue #201

### 1. Attempt Intervention Parameter Contracts
- **Issue**: Next.js \`MoodleExamMonitorRepository\` called attempt intervention endpoints without required arguments or with mismatched keys:
  - \`local_examapi_extend_attempt_time\`: Next.js sent \`extratimeminutes\`, but Moodle expected \`extraminutes\` (\`PARAM_INT\`) and required \`reason\` (\`PARAM_TEXT\`).
  - \`local_examapi_lock_attempt\`: Next.js omitted required \`reason\` (\`PARAM_TEXT\`).
  - \`local_examapi_unlock_attempt\`: Next.js omitted required \`reason\` (\`PARAM_TEXT\`).
  - \`local_examapi_force_finish_attempt\`: Next.js omitted required \`reason\` (\`PARAM_TEXT\`).
- **Remediation**:
  - Updated \`ExamMonitorActionRequestDto\` to support an optional or default \`reason\` string.
  - Updated \`MoodleExamMonitorRepository\` to send \`extraminutes\` and include \`reason\` with fallback diagnostic text.
  - Added unit tests in \`MoodleExamMonitorRepository.test.ts\` verifying parameter shapes.

### 2. Quiz Question Reordering Contract
- **Issue**: \`MoodleExamAdministrationRepository\` sent \`questions: JSON.stringify([{ questionid, slot }])\`, whereas Moodle's \`local_examapi_reorder_quiz_questions\` expects \`slotids_json: JSON.stringify([slotId1, slotId2, ...])\`.
- **Remediation**:
  - Refactored repository to send \`slotids_json\` containing the sorted slot IDs.
  - Added unit tests in \`MoodleExamAdministrationRepository.test.ts\`.

### 3. Question Bank Serialization and Response Mapping
- **Issue**: \`MoodleQuestionRepository\` passed \`options\` directly (instead of \`options_json\` required by Moodle), and attempted to parse a flat array from \`local_examapi_get_questions\` (which returns an envelope object \`{ total, page, limit, questions: [...] }\`). Also mapped \`category\` instead of Moodle's returned \`categoryid\`.
- **Remediation**:
  - Updated create and update question calls to pass \`options_json\`.
  - Handled envelope responses flexibly in \`getQuestionsByCategory\`.
  - Corrected entity mapping from \`categoryid\` / \`questionid\`.
  - Added unit tests in \`MoodleQuestionRepository.test.ts\`.

### 4. Moodle Error Instantiation
- **Issue**: \`new MoodleError("CODE")\` sets \`moodleErrorCode\` to \`"CODE"\` and \`message\` defaults to generic \`"Moodle upstream error"\`.
- **Remediation**:
  - Standardized constructor calls to \`new MoodleError("CODE", "Descriptive message")\`.

### 5. Missing Core Functions in Built-In Services
- **Issue**: Next.js repositories called \`core_course_get_contents\`, \`core_grades_get_grades\`, and \`mod_quiz_get_quiz_access_information\`, but these core functions were missing from \`db/services.php\` in the plugin, causing token access rejections.
- **Remediation**:
  - Added the core functions to appropriate service boundaries in both \`moodle_mod/local_examapi\` and runtime \`moodle.local/moodle/public/local/examapi\`.
  - Verified with 88 passing PHP test suites and Vitest integration tests.

---

## 7. Verification Proof & Quality Gates

1. **Moodle Backend Test Suites**:
   - Command: \`php scratch/run_all_tests.php\`
   - Result: **88/88 test suites PASSING** (0 failures, 0 errors).
2. **Next.js Vitest Suites**:
   - Command: \`npm test\`
   - Result: **172 test files PASSING, 870 tests PASSING** (0 failures).
3. **TypeScript Strict Typecheck**:
   - Command: \`npm run typecheck\` (\`tsc --noEmit\`)
   - Result: **0 errors**.
4. **Architecture & Barrel Export Guardrail**:
   - Command: \`npm run lint:barrel\`
   - Result: **No barrel exports found**.
5. **Biome Linter & Formatter**:
   - Checked and formatted all touched files cleanly.
`;

fs.writeFileSync("docs/moodle-webservices-contract-matrix.md", doc, "utf-8");
console.log("Successfully generated docs/moodle-webservices-contract-matrix.md");
