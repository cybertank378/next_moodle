\<!-- BEGIN:nextjs-agent-rules -->



**# This is NOT the Next.js you know**



This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in \`node_modules/next/dist/docs/\` (resolved from this file's directory; in monorepos the \`next\` package may not be visible from the repo root) before writing any code. Heed deprecation notices.



This block is written and re-added by \`next dev\` — verify at \`node_modules/next/dist/server/lib/generate-agent-files.js\`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.



\<!-- END:nextjs-agent-rules -->



**# Exam SaaS — Agent Engineering Contract**



**## 1. Purpose**



This file defines the mandatory engineering rules for every coding agent working in this repository.



The project is an Exam SaaS in which:



\- **\*\*Next.js\*\*** is the frontend, BFF/API server, session layer, tenant resolver, authorization layer, and application host.

\- **\*\*Moodle\*\*** is the LMS backend, Quiz Engine, Question Engine, Gradebook, enrolment engine, and authoritative source of truth for academic/exam data. The current \`local_examapi\` plugin baseline is Moodle 4.1+ (\`requires = 2022112800\`) and is marked 5.0-compatible by its source.

\- **\*\*Prisma 7 + PostgreSQL\*\*** stores only SaaS operational metadata such as tenants, encrypted tenant credentials, branding, internal SaaS session metadata when required, and SaaS audit logs.

\- Feature modules use **\*\*DDD / Hexagonal Architecture\*\***.

\- UI sections use **\*\*Atomic UI\*\***.

\- Development follows **\*\*TDD: RED → GREEN → REFACTOR\*\***.

\- Authorization uses permission-based **\*\*RBAC\*\*** with \`ADMIN\`, \`TENANT\`, and \`STUDENT\`.

\- Project-authored barrel exports are forbidden.



The agent must optimize for architectural correctness, tenant isolation, testability, security, and maintainability before convenience.



\---



**## 2. Required Reading Before Editing**



Before modifying code, inspect the repository and read the documents relevant to the requested work.



Minimum required reading:



\`\`\`text

AGENTS.md

planning-nextjs-fe-rbac.md

rbac-system.md

issue.md / issueN.md for the active issue

package.json

prisma/schema.prisma when the task touches persistence

\`\`\`



For Next.js work, also obey the managed \`nextjs-agent-rules\` block at the top of this file:



1\. Determine the installed Next.js version from the repository.

2\. Read the relevant local guide under \`node_modules/next/dist/docs/\` before writing Next.js code.

3\. Read deprecation notices that affect the task.

4\. Prefer the installed documentation over remembered Next.js APIs or conventions.

5\. If dependencies/local Next.js docs are unavailable, do not invent framework behavior. Establish the repository state first and report the blocker if it cannot be resolved within the task.



For an issue-driven task, read the whole active issue, not only its title. Respect its dependency, scope, out-of-scope items, checklist, acceptance criteria, and DoD.



\---



**## 3. Instruction Precedence**



When instructions conflict, use this order:



1\. Explicit instruction from the user for the current task.

2\. Security, tenant-isolation, and data-boundary invariants in this file.

3\. For Moodle integration facts: the actual executable \`local_examapi\` contract (\`db/services.php\`, external implementations, \`db/access.php\`, and contract/integration tests).

4\. The active \`issue\*.md\` specification.

5\. \`rbac-system.md\`.

6\. \`planning-nextjs-fe-rbac.md\`.

7\. Existing repository conventions and nearby code.



Do not silently reinterpret an issue. If an implementation would require violating a higher-priority architectural invariant, keep the invariant and surface the conflict.



\---



**## 4. Non-Negotiable Architecture Invariants**



The following rules are mandatory.



\- Browser code never calls Moodle directly.

\- Next.js never connects directly to the Moodle SQL database.

\- Moodle remains authoritative for academic users, courses, enrolments, quizzes, questions, attempts, answers, grades, and review policy.

\- The Next.js integration must conform to the actual \`local_examapi\` service contract; never invent a Moodle WS function because it appears in an older planning document.

\- Do not create a second authoritative attempt/answer store in the SaaS database.

\- Moodle tokens, passwords, service credentials, session secrets, raw exceptions, and stack traces must never be serialized to the browser.

\- \`TENANT\` and \`STUDENT\` operations are always tenant-scoped from trusted session/context state.

\- \`STUDENT\` access to attempt/result resources always requires ownership checks in addition to role/permission checks.

\- Authorization must not depend only on hidden navigation or disabled UI controls.

\- Domain code cannot import React, Next.js, Prisma, the Moodle REST client, \`fetch\`, or infrastructure code.

\- Business rules do not belong in \`route.ts\` or presentational components.

\- Moodle function names such as \`core\_\*\`, \`mod_quiz\_\*\`, and \`local_examapi\_\*\` must not leak into application/domain DTOs or UI code.

\- Student-owned quiz attempts must use the authenticated student Moodle token; admin/proctor service-account tokens must never own or submit a student attempt.

\- No project-authored barrel \`index.ts\` / \`index.tsx\` files.

\- Do not create empty abstractions or folders merely to match a template.



\---





**## 4.1 Audited Moodle Backend Contract**



This agent contract was aligned against the private repository \`cybertank378/moodle_mod\`, path \`local_examapi\`, on the \`main\` branch at commit:



\`\`\`text

1c5723c41151bdb4334a85d8b540efab4307b786

\`\`\`



Audited plugin identity:



\`\`\`text

component      = local_examapi

plugin version = 2026092101

release        = v1.0.0-alpha

maturity       = MATURITY_ALPHA

Moodle baseline= 2022112800 (Moodle 4.1+)

API major      = 1

\`\`\`



Because the Moodle repository evolves independently, any task that adds or changes a Moodle integration MUST re-check the current backend contract before coding. Use this authority order for integration facts:



\`\`\`text

local_examapi/db/services.php

  > local_examapi/classes/external/\* implementation

  > local_examapi/db/access.php

  > local_examapi/api-manifest.json

  > integration/contract tests

  > README/planning documents

\`\`\`



If these sources disagree, do not silently pick the convenient version. Base implementation on executable code and tests, document the discrepancy, and avoid exposing an unsupported frontend feature.



**### Canonical Moodle Service Boundaries**



The plugin defines exactly three built-in service boundaries:



\`\`\`text

nextjs_student  → authenticated student course/quiz/attempt lifecycle

nextjs_admin    → tenant administration, enrolment, question bank, quiz composition

nextjs_proctor  → exam monitoring and attempt intervention

\`\`\`



Do not use one service token as a substitute for another role boundary. In particular, \`svc_nextjs_exam\` and \`svc_nextjs_proctor\` are non-interactive \`auth=nologin\` service accounts; they are not student identities.



Application roles are not the same thing as Moodle service shortnames:



\`\`\`text

AppRole STUDENT + student permission → student-owned \`nextjs_student\` token

AppRole TENANT + admin permission     → tenant's \`nextjs_admin\` token

AppRole TENANT + proctor permission   → tenant's \`nextjs_proctor\` token

AppRole ADMIN touching Moodle         → first resolve an explicit tenant, then use that tenant's appropriate service token

\`\`\`



There is no global cross-tenant Moodle super-token and no required fourth application page role named \`PROCTOR\`. Proctoring is an upstream service/capability boundary selected by BFF authorization.



**### Student Service Contract**



Current \`nextjs_student\` functions include:



\`\`\`text

core_webservice_get_site_info

core_enrol_get_users_courses

mod_quiz_get_quizzes_by_courses

mod_quiz_get_user_attempts

mod_quiz_get_combined_review_options

mod_quiz_start_attempt

mod_quiz_get_attempt_data

mod_quiz_get_attempt_summary

mod_quiz_save_attempt

mod_quiz_process_attempt

mod_quiz_get_attempt_review

gradereport_user_get_grade_items

local_examapi_get_health

local_examapi_get_student_exam_result

local_examapi_get_api_version

local_examapi_get_capabilities

\`\`\`



Important corrections versus older planning text:



\- use \`service=nextjs_student\` for \`/login/token.php\`; do **\*\*not\*\*** use \`moodle_mobile_app\`;

\- use \`mod_quiz_get_user_attempts\`; do **\*\*not\*\*** use the stale name \`mod_quiz_get_user_quiz_attempts\`;

\- do not call \`mod_quiz_get_attempt_access_information\` unless the backend service is explicitly changed to expose it.



**### Tenant Admin Service Contract**



Current \`nextjs_admin\` registers these Moodle core functions:



\`\`\`text

core_webservice_get_site_info

core_user_get_users

core_user_get_users_by_field

core_user_create_users

core_user_update_users

core_course_get_courses

core_course_get_categories

enrol_manual_enrol_users

enrol_manual_unenrol_users

core_cohort_get_cohorts

core_cohort_create_cohorts

core_cohort_add_cohort_members

core_cohort_delete_cohort_members

core_group_get_course_groups

core_group_create_groups

core_group_add_group_members

core_group_get_course_groupings

core_group_create_groupings

core_group_assign_grouping

\`\`\`



Its registered custom functions cover:



\`\`\`text

local_examapi_get_health

local_examapi_get_exam_results

local_examapi_get_exam_statistics

local_examapi_get_audit_logs

local_examapi_get_api_version

local_examapi_get_capabilities

local_examapi_get_question_categories

local_examapi_create_question_category

local_examapi_update_question_category

local_examapi_delete_question_category

local_examapi_get_questions

local_examapi_get_question

local_examapi_create_question

local_examapi_update_question

local_examapi_delete_question

local_examapi_move_question

local_examapi_duplicate_question

local_examapi_import_questions

local_examapi_get_quiz_questions

local_examapi_add_question_to_quiz

local_examapi_remove_question_from_quiz

local_examapi_reorder_quiz_questions

local_examapi_add_random_questions

\`\`\`



The current plugin does **\*\*not\*\*** register custom functions for full quiz lifecycle CRUD such as:



\`\`\`text

local_examapi_create_quiz

local_examapi_update_quiz

local_examapi_delete_quiz

local_examapi_duplicate_quiz

\`\`\`



Therefore, a Next.js feature requiring create/update/delete/duplicate quiz must be treated as **\*\*backend-contract-blocked\*\*** until an approved Moodle function is actually registered and tested. Never invent the function name or bypass the plugin with direct SQL.



**### Proctor Service Contract**



Current \`nextjs_proctor\` integration is:



\`\`\`text

core_webservice_get_site_info

local_examapi_get_health

local_examapi_get_exam_monitor

local_examapi_lock_attempt

local_examapi_unlock_attempt

local_examapi_force_finish_attempt

local_examapi_extend_attempt_time

local_examapi_get_exam_results

local_examapi_get_exam_statistics

local_examapi_get_api_version

local_examapi_get_capabilities

\`\`\`



Current plugin contract does **\*\*not\*\*** expose \`reset_attempt\`, \`force_logout_user\`, or a dedicated incident-evidence CRUD API. Do not implement those Next.js actions as though the Moodle backend supports them. They require a backend contract change first.



**### Moodle Capability Contract**



Capabilities defined by \`db/access.php\` are:



\`\`\`text

local/examapi:view

local/examapi:managequestions

local/examapi:managequizzes

local/examapi:monitor

local/examapi:manageattempts

local/examapi:manageincidents

local/examapi:viewreports

local/examapi:manageintegration

local/examapi:viewaudit

\`\`\`



Do not map application RBAC 1:1 to Moodle capability names. Application RBAC is a BFF authorization layer; Moodle capabilities are the upstream authorization layer. Both must pass where applicable.



**### Known Contract Caveats**



The audited alpha backend currently contains contract/implementation gaps that the frontend must not paper over:



\- \`get_capabilities.php\` checks \`local/examapi:manage\`, but that capability is not defined in \`db/access.php\`; treat \`can_manage\` as unreliable until fixed upstream.

\- \`api-manifest.json\` capability metadata is not a complete mirror of \`db/access.php\`; do not generate application RBAC solely from the manifest capability object.

\- \`question_bank_service\` currently uses static in-memory category/question stores for its operational path. Registered question-bank endpoints therefore must not be treated as production Moodle Question Bank persistence until an integration test proves they are wired to real Moodle storage.

\- \`quiz_composition_service\` currently uses static in-memory quiz/slot stores. Registered quiz-composition endpoints must not be represented as durable Moodle quiz composition until upstream wiring is proven.

\- \`proctor_service\` currently uses static in-memory lock/idempotency/extension stores and default/mock monitor data. A REST success from lock/unlock/force-finish/extend-time must not be treated as proof that a real Moodle attempt was durably changed.

\- \`audit_service\` currently records to an in-memory store in the audited service path even though XMLDB defines \`local_examapi_audit\`; do not claim durable Moodle audit persistence without an integration test proving repository-backed writes.

\- \`local_examapi_get_exam_results\` and \`local_examapi_get_student_exam_result\` currently contain fallback/mock-style return implementations; do not claim production-grade result integration until real Moodle data is proven.

\- \`get_exam_monitor\` currently exposes counters/participant fields but no authoritative heartbeat/online-disconnected field. Do not invent online/offline or last-activity state in the UI.

\- README narrative may lag executable configuration. For example, \`nextjs_student\` is actually registered with \`restrictedusers = 0\` in \`db/services.php\`.

\- The repository contains repository classes for Moodle-backed persistence, but the agent must verify that the active external function actually delegates to them. Existence of a repository class alone does not prove the registered Web Service is production-wired.



**### Backend Readiness Rule**



Distinguish these states explicitly:



\`\`\`text

REGISTERED     = function exists in db/services.php

CONTRACTED     = parameters/returns/capabilities are defined and tested

PERSISTENT     = implementation writes/reads real Moodle/core/plugin storage

PRODUCTION-READY = persistent behavior + authorization + failure semantics + integration tests are proven

\`\`\`



Never infer \`PRODUCTION-READY\` from \`REGISTERED\`. If a requested Next.js feature depends on an endpoint that is only registered/contract-tested with in-memory behavior, mark that feature as backend-blocked or degraded and keep the frontend behavior honest.



\---



**## 5. Required Request Flow**



Preserve this dependency flow:



\`\`\`text

Browser

  ↓

sections/\*

  ↓

modules/\*/presentation/hooks

  ↓

src/app/api/\*/route.ts

  ↓

src/app/api/{feature}/\_factory.ts

  ↓

Infrastructure HTTP Controller

  ↓

RBAC authorization

  ↓

Application Service / Use Case

  ↓

Domain Interface / Rule / Entity

  ↓

Infrastructure Repository / Provider

  ↓

Moodle REST / Prisma SaaS DB / Cache

\`\`\`



Rules:



\- Dependencies point inward toward domain/application abstractions.

\- External-system details are translated at the infrastructure boundary.

\- \`presentation/hooks\` call only the internal Next.js API.

\- \`sections/organisms\` may call presentation hooks.

\- \`sections/atoms\` and \`sections/molecules\` may not perform API calls.

\- \`page.tsx\` composes a section page and should contain minimal orchestration.

\- Route handlers are transport adapters, not use cases.



\---



**## 6. Standard Module Structure**



Use the existing module convention exactly.



\`\`\`text

src/modules/{feature}/

├── application/

│   ├── services/

│   │   └── {Feature}Service.ts

│   └── usecases/

│       ├── Get{Feature}UseCase.ts

│       ├── Create{Feature}UseCase.ts

│       └── ...

│

├── domain/

│   ├── builder/

│   │   └── {Feature}QueryBuilder.ts

│   ├── dto/

│   │   ├── {Feature}RequestDTO.ts

│   │   └── {Feature}ResponseDTO.ts

│   ├── entity/

│   │   └── {Feature}Entity.ts

│   ├── interfaces/

│   │   ├── {Feature}Interfaces.ts

│   │   └── {Feature}RepositoryInterface.ts

│   ├── mapper/

│   │   └── {Feature}Mapper.ts

│   ├── types/

│   │   └── {Feature}Types.ts

│   └── value-object/

│       └── {Feature}ValueObject.ts

│

├── infrastructure/

│   ├── http/

│   │   └── {Feature}Controller.ts

│   ├── providers/

│   │   └── {Feature}Provider.ts

│   ├── repo/

│   │   └── {Feature}Repository.ts

│   ├── templates/

│   │   └── ...

│   └── validators/

│       └── {feature}Validator.ts

│

├── presentation/

│   ├── helpers/

│   │   └── ...

│   └── hooks/

│       └── use{Feature}Api.ts

│

└── \_\_tests\_\_/

    ├── application/

    ├── domain/

    ├── infrastructure/

    └── helpers/

\`\`\`



Naming is deliberate:



\- use \`entity\`, not \`entities\`;

\- use \`repo\`, not \`repositories\`;

\- HTTP controller belongs in \`infrastructure/http\`;

\- API dependency composition belongs in \`src/app/api/{feature}/\_factory.ts\`;

\- optional folders are created only when they contain a real responsibility.



**### Layer Responsibilities**



**#### Domain**



May contain:



\- entities;

\- value objects;

\- repository/provider interfaces;

\- pure rules;

\- query builders;

\- domain types;

\- DTO/entity mapping that does not depend on external protocols.



Must not contain:



\- Prisma calls;

\- Moodle payload shapes;

\- HTTP concerns;

\- React/Next.js;

\- \`fetch\`;

\- cookies;

\- framework-specific request/response objects.



**#### Application**



May contain:



\- use cases;

\- application services coordinating multiple use cases/domain ports;

\- transaction/workflow orchestration through abstractions.



Application code depends on domain/core abstractions, not concrete infrastructure.



**#### Infrastructure**



Owns:



\- Moodle protocol mapping;

\- Prisma implementation;

\- HTTP controllers;

\- encryption/mail/cache/external providers;

\- infrastructure validators where the current project pattern requires them;

\- translation of third-party errors into application errors.



Never expose raw external response shapes to application/presentation.



**#### Presentation**



Owns frontend-facing hooks/helpers only.



A presentation hook calls the internal BFF route, not Moodle and not Prisma.



\---



**## 7. Atomic UI Rules**



Every feature UI follows:



\`\`\`text

src/sections/{feature}/

├── atoms/

├── molecules/

├── organisms/

└── pages/

\`\`\`



**### Atoms**



\- props only;

\- no API calls;

\- no feature orchestration.



**### Molecules**



\- data via props;

\- callbacks via props;

\- no API calls;

\- no feature repository/use-case access.



**### Organisms**



\- coordinate feature state;

\- may call the feature presentation hook;

\- own loading/error/interaction orchestration for a section.



**### Pages**



\- compose organisms/molecules;

\- minimal orchestration;

\- are consumed by \`src/app/\*\*/page.tsx\`.



**### Management UI Standard**



Use this order when relevant:



\`\`\`text

Page Header

↓

Statistics

↓

Filter / Search

↓

Table

↓

Pagination

\`\`\`



Loading behavior:



\- keep the page header visible;

\- keep filters visible;

\- use Skeleton/TableSkeleton in the content area;

\- do not replace the entire page with a generic spinner.



Empty behavior:



\- do not hide the page header;

\- do not hide filters;

\- preserve table header when appropriate;

\- replace only the content/table body with \`EmptyState\`.



Management tables must use the existing shared Pagination/Table/Skeleton/EmptyState abstractions instead of creating feature-local duplicates without a concrete reason.



\---



**## 8. App Router Role Boundaries**



The three application actors have separate page trees.



\`\`\`text

/admin/\*    → ADMIN

/tenant/\*   → TENANT

/student/\*  → STUDENT

\`\`\`



Expected route groups:



\`\`\`text

src/app/(admin)/admin/\*

src/app/(tenant)/tenant/\*

src/app/(student)/student/\*

\`\`\`



Mandatory layout guards:



\`\`\`text

(admin)/admin/layout.tsx

  → requireRole(ADMIN)



(tenant)/tenant/layout.tsx

  → requireRole(TENANT)

  → require tenantId



(student)/student/layout.tsx

  → requireRole(STUDENT)

  → require tenantId

\`\`\`



A page-role mismatch may redirect to a safe page, but API authorization failures must still return the correct \`401\` or \`403\` response.



Do not collapse the three role trees into a single generic protected dashboard.



\---



**## 9. RBAC and Authorization**



Application roles:



\`\`\`ts

ADMIN

TENANT

STUDENT

\`\`\`



Authorization enforcement order:



\`\`\`text

Session validation

→ role validation

→ permission validation

→ tenant isolation

→ ownership/resource rule

→ use case

→ repository

\`\`\`



**### ADMIN**



Platform-level actor. May perform cross-tenant platform administration when a specific operation permits it.



**### TENANT**



Institution administrator/operator.



Mandatory rules:



\- actor has a valid \`tenantId\`;

\- session tenant is the trusted source of tenant scope;

\- request body/query/path must not silently override tenant scope;

\- repository calls and Moodle client factories receive an already validated tenant context.



**### STUDENT**



Mandatory rules:



\- actor has a valid \`tenantId\`;

\- student may access only resources allowed by Moodle and the application permission set;

\- attempt/result operations require own-resource checks;

\- permissions such as \`attempt.read.own\` do not imply access to another student's attempt.



**### Authorization Is Multi-Layered**



For protected behavior, enforce authorization at all applicable levels:



1\. server layout/page guard;

2\. API/controller guard;

3\. application/domain tenant/ownership rule.



UI action visibility is an ergonomics feature, not a security boundary.



\---



**## 10. API Route Rules**



Use feature routes under \`src/app/api/\` and one \`\_factory.ts\` per feature boundary where dependency assembly is required.



Do not introduce \`/api/v1\` unless the architecture documents are explicitly changed.



A route handler should only:



1\. parse and validate transport input;

2\. resolve actor/tenant/request context;

3\. obtain the controller/dependencies from \`\_factory.ts\`;

4\. call the controller;

5\. return the standardized response.



Do not put the following in \`route.ts\`:



\- business decisions;

\- Moodle-specific response mapping;

\- Prisma queries;

\- exam rules;

\- tenant ownership rules that belong in application/domain;

\- repeated dependency construction logic.



**### Standard Response**



Success:



\`\`\`json

{

  "success": true,

  "data": {},

  "meta": {}

}

\`\`\`



Error:



\`\`\`json

{

  "success": false,

  "error": {

    "code": "FORBIDDEN",

    "message": "Anda tidak memiliki akses ke resource ini."

  }

}

\`\`\`



Never return raw Moodle exceptions, internal stack traces, tokens, credentials, or database details.



\---



**## 11. Moodle Boundary**



Moodle is not a generic database behind Next.js. It is an external authoritative LMS domain.



**### Allowed communication**



\`\`\`text

Next.js server

  ↓ HTTPS REST

Moodle Web Service / local_examapi

\`\`\`



**### Forbidden communication**



\`\`\`text

Browser → Moodle

Next.js → Moodle SQL port

UI → Moodle function name

Domain → Moodle REST payload

\`\`\`



All Moodle calls must flow through the central server-only Moodle adapter or a module repository using it.



**### Integration Preflight**



For each tenant Moodle connection, the BFF should validate compatibility before enabling dependent features:



\`\`\`text

1\. core_webservice_get_site_info with the correct service token

2\. local_examapi_get_health

3\. require component == local_examapi

4\. require apiversion == 1 for this integration generation

5\. compare pluginversion against the minimum version required by the feature; for the audited contract in this file, features described here require at least \`2026092101\` unless the issue states otherwise

6\. optionally query local_examapi_get_api_version / get_capabilities

7\. enable only functions/features proven available by the current backend contract

\`\`\`



Treat \`api-manifest.json\` semantics as:



\`\`\`text

missing required     → incompatible / fail preflight

missing recommended  → degraded feature set / warning

missing optional     → feature disabled / informational

\`\`\`



Never downgrade a missing required function into a frontend workaround that changes the source of truth.



**### Service Token Selection**



Use the token that matches the operation:



\`\`\`text

Student attempt/course/grade path → authenticated student's nextjs_student token

Tenant administration path        → decrypted per-tenant nextjs_admin service token

Proctor intervention path          → decrypted per-tenant nextjs_proctor service token

\`\`\`



The service token is selected server-side from trusted actor/tenant context, never from a browser-supplied token selector.



Core adapter:



\`\`\`text

src/core/moodle/

├── MoodleRestClient.ts

├── MoodleClientFactory.ts

├── MoodleCredentialProvider.ts

├── MoodleErrorMapper.ts

└── types/

\`\`\`



\`MoodleRestClient\` owns:



\- REST POST transport;

\- Moodle nested parameter encoding;

\- timeout handling;

\- response parsing;

\- Moodle exception detection/mapping;

\- non-2xx handling;

\- request ID propagation;

\- secret-safe logging.



It must remain server-only.



A feature module must not add a second ad-hoc Moodle \`fetch()\` path.



**### Moodle Function Names**



Names like:



\`\`\`text

core\_\*

mod_quiz\_\*

local_examapi\_\*

\`\`\`



are infrastructure details. Translate them behind repositories/providers. Application use cases operate with domain language such as \`QuestionRepository.create()\` or \`StartQuizAttemptUseCase\`.



\---



**## 12. Prisma 7 / SaaS Database Rules**



Prisma/PostgreSQL is for SaaS operational data, not a replacement Moodle academic store.



Allowed examples:



\- tenant identity/status;

\- encrypted Moodle service credentials;

\- tenant branding;

\- SaaS/BFF audit logs for platform-level operations;

\- correlation metadata that links BFF actions to Moodle-side audit events;

\- application session metadata when required by the approved session design.



Do not persist authoritative copies of:



\- Moodle academic users;

\- course data;

\- quiz definitions as an alternative source of truth;

\- question bank data as an alternative source of truth;

\- attempts/answers/grades as an alternative source of truth.



Before editing Prisma code:



1\. inspect \`prisma/schema.prisma\`;

2\. inspect generated Prisma types/client conventions in the repository;

3\. use the installed Prisma 7 API/conventions rather than remembered older Prisma behavior;

4\. preserve migration safety;

5\. never run destructive reset/drop operations unless the user explicitly requests and approves that outcome.



Repository/domain code must not expose Prisma-generated types across the domain boundary.



\---



**## 13. Credential and Secret Security**



Tenant Moodle credentials follow the approved server-side encryption design.



Required properties include:



\- \`aes-256-gcm\`;

\- tenant-specific key derivation via HKDF-SHA256;

\- random 12-byte IV per encryption;

\- 16-byte GCM authentication tag;

\- master key from server environment;

\- no browser serialization of decrypted credentials.



Logging must redact at minimum:



\- Authorization headers;

\- Moodle service tokens;

\- user Moodle tokens;

\- passwords;

\- reset tokens;

\- session secrets;

\- encryption secrets.



Do not add debug logging that leaks credentials to make a test or integration easier.



\---



**## 13.1 Dual Audit Boundary**



\`local_examapi\` owns its own Moodle-side immutable intervention audit table (\`local_examapi_audit\`) and attempt lock table (\`local_examapi_attempt_lock\`). The SaaS database may also keep BFF/platform audit events, but the two have different responsibilities.



Rules:



\- do not duplicate Moodle intervention history as an alternative authoritative record;

\- propagate a correlation/request ID where the backend contract supports it;

\- proctor lock/unlock/force-finish/extend-time success must be accepted only after Moodle confirms it;

\- frontend state must not mark an intervention successful merely because a local SaaS audit row was written.



\---



**## 14. Authentication and Session Rules**



Tenant/student authentication uses Moodle REST through the BFF.



Expected flow:



\`\`\`text

Browser

  ↓ POST /api/auth/login

AuthController

  ↓ resolve tenant

Auth Service / Login Use Case

  ↓

Moodle Auth Repository

  ↓ /login/token.php with service=nextjs_student

  ↓ core_webservice_get_site_info using the returned student token

  ↓ resolve actor role + tenant membership

  ↓ create signed/encrypted application session

  ↓ HttpOnly Secure cookie

\`\`\`



Raw Moodle tokens never become JavaScript-visible browser state.



Current actor contract:



\`\`\`ts

interface CurrentActor {

  readonly id: string;

  readonly role: AppRole;

  readonly tenantId: string | null;

  readonly moodleUserId: number | null;

  readonly permissions: readonly string[];

}

\`\`\`



Invariants:



\- \`ADMIN\` may have \`tenantId = null\`.

\- \`TENANT\` must have a tenant.

\- \`STUDENT\` must have a tenant.



\---



**## 15. TDD Is Mandatory**



All behavior changes follow:



\`\`\`text

RED → GREEN → REFACTOR

\`\`\`



**### RED**



Before production code for a testable behavior:



\- write or update the domain/application test;

\- use mocked domain ports/repositories where appropriate;

\- write authorization/tenant-isolation tests for protected operations;

\- for a bug, first add a regression test that fails for the reported bug.



A RED test must fail for the intended reason, not because of a syntax error, broken fixture, or unrelated failure.



**### GREEN**



Implement the minimum correct production behavior to make the intended tests pass.



Do not use GREEN as an excuse to violate layer boundaries.



**### REFACTOR**



After tests pass:



\- remove duplication;

\- improve naming;

\- keep behavior unchanged;

\- keep dependency direction intact;

\- remove temporary implementation hacks;

\- rerun relevant tests;

\- do not introduce a barrel export while cleaning imports.



**### Test Placement**



Match the module structure:



\`\`\`text

src/modules/{feature}/\_\_tests\_\_/

├── application/

├── domain/

├── infrastructure/

└── helpers/

\`\`\`



Do not create a test that only asserts mocks were called when a business outcome can be asserted instead.



\---



**## 16. TypeScript and Code Quality**



\- Keep TypeScript \`strict\` enabled.

\- Do not solve a type problem by disabling compiler checks.

\- Avoid \`any\`; use explicit types, \`unknown\`, generics, or narrowers.

\- Do not add \`@ts-ignore\`, \`@ts-nocheck\`, or broad lint/Biome suppressions merely to pass CI.

\- A narrow suppression is allowed only when unavoidable, scoped to the exact line/rule, and documented with the technical reason.

\- Prefer immutable inputs/outputs where practical (\`readonly\`).

\- Validate untrusted transport/external input at boundaries.

\- Use explicit domain/application error types instead of throwing arbitrary strings.

\- Keep functions cohesive and small enough that responsibilities remain obvious.

\- Reuse existing core/shared abstractions before inventing a duplicate.



\---



**## 17. No-Barrel Policy**



Project-authored barrel exports are forbidden.



Do not create:



\`\`\`text

src/modules/auth/index.ts

src/modules/auth/domain/index.ts

src/sections/auth/index.ts

src/core/index.ts

src/shared-ui/index.ts

\`\`\`



Do not add:



\`\`\`ts

export \* from "./AuthService";

export \* from "./LoginUseCase";

\`\`\`



Use concrete imports:



\`\`\`ts

import { LoginUseCase } from "@/modules/auth/application/usecases/LoginUseCase";

import { AuthController } from "@/modules/auth/infrastructure/http/AuthController";

import LoginPageSection from "@/sections/auth/pages/LoginPageSection";

\`\`\`



An \`index.ts\` is acceptable only when it is a genuine runtime entry point owned by external/generated code and not a project-authored re-export barrel.



Never introduce a barrel during refactoring to shorten imports.



\---



**## 18. Issue Execution Protocol**



When implementing \`issue.md\`, \`issue2.md\`, ..., \`issue20.md\`:



1\. Read the full issue.

2\. Verify listed dependencies are satisfied in the repository.

3\. Work only inside its scope plus strictly necessary supporting changes.

4\. Respect all \`Out of Scope\` items.

5\. Implement checklist items in dependency order.

6\. Follow RED → GREEN → REFACTOR for each behavior cluster.

7\. Satisfy every acceptance criterion.

8\. Satisfy the issue DoD.

9\. Run verification commands.

10\. Mark a checklist item complete only after the corresponding implementation/test actually exists and passes.



Do not pre-implement future issues merely because adjacent code would be convenient to add now.



If the issue specification and existing code disagree, inspect the repository history/current architecture before modifying broad areas. Prefer a small deliberate migration over a parallel architecture.



\---



**## 19. Change Discipline**



Before editing:



\- inspect nearby files and tests;

\- search for an existing equivalent abstraction/component/helper;

\- identify all call sites for a changed contract;

\- understand whether the code is server-only or client-visible.



While editing:



\- keep the patch focused;

\- do not rewrite unrelated files;

\- do not rename broad directory trees unless required by scope;

\- preserve public contracts unless the issue explicitly changes them;

\- update tests alongside contract changes;

\- update planning/RBAC docs only when architecture itself changes, not for routine implementation details.



Do not delete working behavior to make a test pass.



Do not perform destructive Git, database, migration, or filesystem operations unless explicitly required and safe for the requested task.



\---



**## 20. Error Handling**



Normalize errors at boundaries.



Expected categories include:



\- validation errors;

\- unauthorized (\`401\`);

\- forbidden (\`403\`);

\- not found (\`404\`);

\- domain conflict/rule failure;

\- Moodle/infrastructure failure;

\- transient timeout/network failure.



External exceptions must be mapped to stable application error codes/messages.



Do not expose:



\- Moodle stack traces;

\- SQL details;

\- Prisma internals;

\- encrypted/decrypted credentials;

\- raw upstream payloads containing sensitive fields.



\---



**## 21. Exam Attempt Safety**



The quiz-attempt domain is high priority and must remain Moodle-authoritative.



Current student attempt transport contract uses:



\`\`\`text

mod_quiz_get_user_attempts

mod_quiz_start_attempt

mod_quiz_get_attempt_data

mod_quiz_get_attempt_summary

mod_quiz_save_attempt

mod_quiz_process_attempt

mod_quiz_get_attempt_review

\`\`\`



For student attempt operations:



\- validate role and permission;

\- validate tenant scope;

\- validate attempt ownership;

\- respect Moodle access rules and attempt state;

\- use Moodle functions through infrastructure only;

\- do not derive authoritative attempt state only from client timestamps;

\- do not create an alternative autosave store that can diverge from Moodle;

\- handle duplicate/retry behavior deliberately;

\- preserve safe handling for expired/finished attempts.



UI network/offline state must not pretend an unsaved answer was accepted by Moodle.



\---



**## 21.1 Question Bank and Quiz Composition Contract**



The question service contract recognizes these qtypes in the audited source:



\`\`\`text

multichoice

truefalse

shortanswer

numerical

essay

match

multichoice_complex

\`\`\`



Question update supports optimistic concurrency through \`expected_timemodified\`. Preserve the OCC token across read/edit/update flows and map upstream OCC conflicts (currently represented by \`OCC_QUESTION_CONFLICT\` in service code; older docs mention \`versionmismatch\`) into a stable application conflict error that prompts a safe refresh/reconciliation path.



Bulk question import supports \`dryrun\` and row-level diagnostics. Do not reduce the response to a single success boolean; preserve processed/success/failed/warning counts and item diagnostics in the infrastructure-to-domain mapping as needed by the UI.



Quiz composition currently covers question slots only (get/add/remove/reorder/random). Full quiz lifecycle management is not part of the registered custom contract at the audited backend version.



\---



**## 22. Monitoring and Administrative Actions**



The registered monitor response currently contains:



\`\`\`text

quizid, courseid, name

counters.total_enrolled / not_started / in_progress / finished / overdue / locked

participants[].userid / fullname / attemptid / attempt_number / state

participants[].timestart / timefinish / timeleft_seconds / currentpage

participants[].is_locked / incidentref

page / limit / total_pages / timestamp

\`\`\`



\`is_locked\` is transported as integer \`1/0\` in the current external return definition; normalize it at the infrastructure mapper boundary. There is no registered authoritative \`online\`, \`disconnected\`, \`last_activity\`, or heartbeat field in this response.



High-impact actions currently supported by the Moodle proctor contract include:



\- lock attempt;

\- unlock attempt;

\- force finish attempt;

\- extend attempt time.



The current domain service enforces 1–60 minutes per extension and 120 minutes cumulative per attempt, even though one external parameter description mentions 1–180. Treat executable service validation as authoritative until the backend contract is reconciled.



Platform-side high-impact actions may also include tenant status changes and credential updates.



Do not present \`reset attempt\` or \`force logout user\` as Moodle-backed capabilities unless \`local_examapi\` is extended and its service contract/tests are updated first.



These actions require:



\- explicit permission checks;

\- tenant-scope validation where applicable;

\- validated input;

\- stable error handling;

\- SaaS audit logging when required by the active issue;

\- tests proving unauthorized actors cannot perform the action.



Never rely on a hidden button as the authorization mechanism.



**### Attempt Lock Enforcement**



The companion plugin \`quizaccess_examapi\` is intended to block Moodle quiz access by consulting \`local_examapi\service\proctor_service::is_attempt_locked()\`. The audited companion version \`2026092101\` depends on \`local_examapi >= 2026092101\`.



However, the audited \`proctor_service\` lock state is currently held in a PHP static in-memory store. Under normal separate PHP requests, this does not prove durable cross-request lock persistence. Therefore hard-lock behavior is **\*\*not production-proven\*\*** merely because both plugins are installed.



Rules:



\- do not claim that an attempt is durably blocked after a successful lock response until an end-to-end test proves persistence across independent requests;

\- do not emulate the lock only in Next.js, because Moodle remains authoritative;

\- treat persistent lock enforcement as backend-blocked until \`local_examapi\` is wired to durable storage/repository behavior and the companion rule observes that state;

\- after upstream persistence is fixed, source lock/unlock state from Moodle, not client state.



\---



**## 23. Performance and Data Access**



\- Avoid N+1 calls to Moodle.

\- Monitoring should consume aggregated backend/custom-plugin data rather than polling Moodle separately for every participant.

\- Paginated management screens must use the project Pagination contract.

\- Do not fetch all rows merely to paginate in the browser when a server-side query is available.

\- Avoid duplicating Moodle data in PostgreSQL as a performance shortcut unless the architecture explicitly introduces a cache/read model and defines its invalidation semantics.

\- Cache must never silently become the source of truth for attempts or grades.



\---



**## 24. Verification Before Completion**



For every completed issue/change, run the relevant verification commands.



Baseline:



\`\`\`bash

npm run typecheck

npm run lint

npm run test

npm run build

\`\`\`



Also run focused tests during development, then the full required suite before declaring the work done.



When the change adds integration/E2E behavior, run the repository's relevant integration/E2E command as required by the active issue.



For Moodle integration changes, also verify against the current \`local_examapi\` contract. At minimum:



\- function name is present in \`db/services.php\` for the intended service;

\- required capability exists in \`db/access.php\`;

\- parameter/return mapping matches the external implementation;

\- service token type is correct (\`nextjs_student\`, \`nextjs_admin\`, or \`nextjs_proctor\`);

\- alpha/stub endpoints are not represented to users as production-complete without a real integration test.



Do not claim success when:



\- tests were not run;

\- verification failed;

\- failures were ignored as "unrelated" without establishing that they pre-existed;

\- typecheck/lint was bypassed;

\- only the happy path was tested for an authorization-sensitive feature.



If a pre-existing failure blocks verification, report the exact command and failure separately from the changes made.



\---



**## 25. Completion Report**



When reporting completed implementation work, include concise factual information:



\- issue/task implemented;

\- major files or architectural areas changed;

\- RED tests added;

\- final test/build verification results;

\- any remaining limitation or intentionally out-of-scope item.



Do not claim a checklist item or DoD item is complete unless it is actually satisfied in the repository.



\---



**## 26. Final Agent Checklist**



Before finishing any code task, confirm:



\- [ ] I read the active issue and relevant architecture/RBAC documents.

\- [ ] I read the relevant installed Next.js documentation before using framework APIs.

\- [ ] I did not rely on obsolete Next.js behavior from memory.

\- [ ] I respected domain/application/infrastructure/presentation boundaries.

\- [ ] I kept \`route.ts\` thin.

\- [ ] I kept Moodle calls server-side and behind adapters.

\- [ ] I re-checked the current \`local_examapi\` service contract for every changed Moodle integration.

\- [ ] I used the correct service identity/token (\`nextjs_student\`, \`nextjs_admin\`, or \`nextjs_proctor\`).

\- [ ] I did not use stale function names from planning when they differ from \`db/services.php\`.

\- [ ] I did not invent unsupported Moodle functions or claim alpha/stub endpoints are production-complete.

\- [ ] I distinguished registered/contracted endpoints from durable production-wired behavior.

\- [ ] I did not invent online/offline monitoring fields that \`get_exam_monitor\` does not return.

\- [ ] I did not treat a proctor lock response as durable Moodle enforcement without cross-request integration proof.

\- [ ] I did not introduce direct Moodle SQL access.

\- [ ] I did not expose secrets/tokens/raw infrastructure errors.

\- [ ] I enforced RBAC server-side.

\- [ ] I enforced tenant isolation for tenant-scoped behavior.

\- [ ] I enforced ownership for student-owned resources.

\- [ ] I followed RED → GREEN → REFACTOR.

\- [ ] I added a failing regression test first for bug fixes.

\- [ ] I followed the module naming pattern (\`entity\`, \`repo\`, controller in \`infrastructure/http\`).

\- [ ] I followed Atomic UI boundaries.

\- [ ] I preserved Skeleton/EmptyState/Pagination behavior for management UI.

\- [ ] I did not add a project barrel \`index.ts\` / \`index.tsx\`.

\- [ ] I did not create empty abstractions/folders without a real responsibility.

\- [ ] I ran typecheck, lint, tests, and build as required.

\- [ ] I did not mark unfinished work as complete.


---

## 27. Project Optimization — Additional Rules

This section adds the optimization requirements from issue #151 to the engineering contract above. Sections 1–26 and the supplied Next.js agent-rules block remain unchanged. These additions do not replace the existing Moodle, RBAC, tenant, ownership, architecture, TDD, or verification requirements.

### Authorized server-read extension

The request flow in section 5 describes browser/client requests. Initial server rendering may use a server section/page or server organism with a `server-only` loader that calls the same authorized use cases. Dependency assembly continues to use `src/app/api/{feature}/_factory.ts`; a reusable server-safe dependency getter may be exposed there. The loader must enforce session, role, permission, tenant, ownership, and current resource access rules before invoking the use case. Atoms/molecules remain presentational and App Router pages stay thin. Do not self-fetch internal HTTP, fabricate a Request, or serialize a session/Moodle token into client props.

### Optimization scope and baseline

The following 20 rules retain IDs `1.1`–`4.5` from [optimization issue #151](https://github.com/cybertank378/next_moodle/issues/151). They extend this engineering contract and remain subject to its Moodle authority, tenant isolation, ownership, layer boundaries, and backend readiness rules. Adding this guidance does not complete the implementation issue.

Initial optimization audit: `development` at commit `45b7382dcf30136563ec32b4e0100b81b2ceea1b`, 7 October 2026. At that snapshot, `package.json` declared Next.js `^16.3.5`, React `^19.3.0`, and Prisma v7 with `@prisma/adapter-pg`; `cacheComponents` was not enabled. Re-check the installed version, lockfile, configuration, and local Next.js docs before applying any framework-specific rule. These values are an audit snapshot, not a requirement to pin or upgrade dependencies.

Existing implementation anchors include `src/libs/prisma.ts`, `src/libs/apiClient.ts`, `src/core/moodle/MoodleCacheAdapter.ts`, `src/core/security/RateLimiter.ts`, `src/core/security/RateLimitConfig.ts`, `src/modules/auth/server/`, and the notification outbox/worker. Reuse and audit them before introducing replacements. Cache, Image, and rate-limit changes must not enable an unsupported Moodle feature or turn an alpha/in-memory backend response into a claimed durable result.

### 27.1 Cache and data freshness

#### 1.1 User-specific data bypasses persistent caches

- Browser reads go through an authenticated internal Route Handler with `fetch(..., { cache: "no-store", credentials: "include" })`. Private responses, including private error responses, carry `Cache-Control: private, no-store`; reverse proxies/CDNs must respect it.
- Server-rendered reads use the authorized server loader/use case directly, following the authorized server-read extension in this section. Do not self-fetch the application's `/api`. User-dependent upstream requests explicitly use `cache: "no-store"` through the central Moodle adapter.
- Sessions, tokens, authorization decisions, private dashboards, enrollment per user, attempts, answers, grades, personal notifications, and exam access decisions must not enter persistent Next Data Cache, Full Route Cache, Moodle TTL caches, or shared Redis caches. Do not wrap them in `force-cache`, `unstable_cache`, or a shared `use cache` function. React request-scoped deduplication remains allowed.
- Audit every cache layer. Fetch `no-store` does not disable a custom cache adapter or clear client query state. Never create an authoritative PostgreSQL attempt/answer/grade store to work around this policy.

#### 1.2 Declare the freshness hierarchy

| Data category | Initial policy | Conditions |
| --- | --- | --- |
| Safe public/static content | Revalidate after 3,600 seconds | No identity, permission-dependent results, or private tenant information; content-hashed public assets may be immutable |
| Safe catalog metadata shared within one tenant | Revalidate after 120 seconds; justify different TTLs | Excludes user enrollment, user capability results, and student-filtered course lists |
| Personal, transactional, security, or realtime data | No persistent cache; `no-store` | Session, ownership, permission, tenant, access, and current resource state are validated again at action time |

- Revalidation TTL is not a hard maximum data age. Some models serve stale content during request-triggered refresh. Use direct reads when an action requires current truth, including start/save/submit and proctor interventions.
- Catalog keys/tags include tenant, Moodle source identity, resource, canonically serialized parameters, and service-context version when relevant. Invalidate related entries when source/credentials change. Never place raw tokens in keys, tags, URLs, or logs.
- Site info/capability responses can contain user identity or permission-dependent data. Cache only explicitly separated, safe metadata; never cache the full response as globally static or use a cached capability as the sole access decision.

#### 1.3 Invalidate server caches and refresh the owning view after mutations

- Map each mutation to its affected cache keys, tags, paths, and views. Invalidate only after the authoritative operation succeeds: SaaS transaction commit for SaaS metadata, or a Moodle success with the persistence/readiness guarantees required by sections 4.1, 21, and 22.
- Use `revalidatePath` and/or registered cache tags for affected Next caches. `revalidateTag(tag, "max")` is suitable when stale-while-revalidate is acceptable. For immediate expiry from a Route Handler, use `revalidateTag(tag, { expire: 0 })` when supported by the installed version. `updateTag(tag)` belongs only in Server Actions. Avoid the deprecated single-argument tag overload.
- Invalidate custom Moodle/Redis cache entries separately; Next tag/path invalidation does not clear an application Map or arbitrary Redis keys.
- After a client mutation, `router.refresh()` updates views owned by Server Components. Refetch or invalidate affected client-hook/query keys as well when they own the displayed data. `router.refresh()` does not invalidate server caches or automatically refetch a hook's local state.
- If a resource is never cached, record that policy and still refresh the affected view. An invalidation failure after a successful write must not trigger a blind repeat of the mutation; handle/retry the invalidation without duplicating the write.

#### 1.4 Refresh sensitive data on focus/visibility return

- Use a single screen-scoped focus/`visibilitychange` mechanism for sensitive screens. Refresh only when visible, throttle/deduplicate work, handle offline state, and remove listeners on cleanup.
- Refresh Server Component data with `router.refresh()` and refetch client-owned data through its existing hook. Preserve draft answers, autosave, timers, and pending exam operations. Clear private client state on logout or account/tenant change.
- `experimental.staleTimes` controls the client Router Cache; it is not server invalidation or an authorization guarantee. Do not enable/extend it globally without testing the installed version, back/forward navigation, logout, and scope changes. SWR/TanStack `staleTime`/focus revalidation is a separate client-query policy.

#### 1.5 Isolate cookie/request reads without weakening protected boundaries

- Reuse the server session resolvers and keep `cookies()`/`headers()` access in the smallest appropriate server loader/component. Place runtime/slow UI under `<Suspense>` with a useful fallback where streaming is appropriate.
- Never serialize the full session, Moodle token, cookie, or service credentials to Client Components; pass the minimum safe DTO.
- Without Cache Components/PPR, a cookie-dependent route remains dynamic; `<Suspense>` alone does not preserve a static Full Route Cache entry. Evaluate a compatible Cache Components/PPR migration separately when a static shell with personalization is required.
- If that model is enabled, apply the installed `use cache`/`cacheLife`/`cacheTag` APIs only to eligible data, and remove or migrate incompatible legacy segment configuration deliberately. Preserve layout, loader, use-case permission, tenant, and ownership checks.

### 27.2 useEffect and server data access

#### 2.1 Initial data comes from Server Components

- Load initial data in a server section/page or server organism through a `server-only` authorized loader. `src/app/**/page.tsx` remains a thin entry/metadata boundary with minimal orchestration.
- Avoid the empty page -> mount -> effect -> fetch waterfall when the server can provide initial data. Seed the existing client hook when client interaction is still required; prevent a second identical mount fetch and reconcile refreshed props without discarding unsaved input.
- Effects synchronize browser state after render: listeners, subscriptions, browser integrations, focus refresh, or necessary polling. User-triggered mutations belong in event handlers.

#### 2.2 Start independent reads together and stream slow sections

- After required authentication/scope checks, start independent promises at the highest server level that owns their context. Keep only true dependencies sequential, such as courses before their quizzes.
- Use `Promise.all` for one required unit, or per-section results/`Promise.allSettled` for independent optional widgets. Do not await every promise in a parent before returning all `<Suspense>` boundaries when streaming is intended.
- `<Suspense>` defines loading/streaming boundaries; data dependencies still need explicit code. Limit fan-out/concurrency for multiple Moodle courses/tenants so parallelism does not exhaust upstream or database resources.

#### 2.3 Share use cases, preserve dependency assembly and authorization

- Server loaders and Route Handlers use the same application/domain logic through their respective server/transport boundaries. API dependency assembly remains in the existing `src/app/api/{feature}/_factory.ts` convention; expose reusable server-safe dependency getters there when needed instead of building a parallel dependency graph.
- A server loader resolves trusted session/tenant context and enforces the same role, permission, ownership, and resource rules as the HTTP path. Direct invocation must not bypass controller-only authorization; move reusable checks to an appropriate shared server/application boundary when necessary.
- Do not call a controller with a fabricated `Request`, self-fetch internal HTTP, duplicate queries/rules in UI, or leak protocol names/credentials into presentation. Atoms/molecules remain presentational.

#### 2.4 Handle failures per data section

- Check `response.ok`, the internal envelope, parsing failures, timeouts, and Moodle exceptions returned with HTTP 200. Keep transport/error mapping in infrastructure; retry only operations that are proven safe to repeat.
- Optional widgets get distinct loading, error/retry, empty, or explicitly stale states. Preserve the rest of the page and its useful assets; do not fabricate scores or successful interventions as fallback data.
- Authentication, scope, ownership, and transactional exam checks fail closed. Do not convert their failure into a successful empty dataset or swallow framework `redirect()`/`notFound()` control flow.

#### 2.5 Distinguish request deduplication from persistent caching

- Eligible identical GET/HEAD fetches can be deduplicated within a React server render. This is not persistent cross-request caching, and does not automatically apply to Route Handlers, Moodle POST calls, or Prisma queries.
- React `cache()` may deduplicate an appropriate direct loader within one request. Cross-request reuse follows the permitted categories, keys, TTLs, and invalidation rules above.
- Reuse current client hooks. SWR/TanStack Query are not dependencies in the initial audit; add one only for a demonstrated need, measure its bundle cost, scope private client keys by tenant/user, and reset them on session/scope changes.

### 27.3 Memory, bundles, media, and state

#### 3.1 Analyze production bundles on every release

- Record route chunks, compressed transfer size, heavy dependencies, build time, and peak build/runtime heap/RSS before and after changes. Select an analyzer compatible with the installed Next.js version and active bundler.
- Remove unused dependencies only after checking direct/dynamic imports, configuration, scripts, and tests; update the lockfile and rerun required checks.
- Establish per-route initial-JS, media, and HTML/RSC budgets from a measured baseline; regressions above 10% require explanation/review. Keep student routes from loading admin-only editors, calendars, charts, or other heavy features they do not use.

#### 3.2 Review the extent of `use client`

- Report changed client boundaries and their imported/chunk footprint. Directive counts are a review signal, not a replacement for bundle measurement.
- Move interactions to leaf components or the smallest useful interactive island. Keep presentational parents/server sections on the server when possible; pass server-rendered children through client shells by composition.
- Lazy-load heavy editors, calendars, charts, and modals when needed. Use `ssr: false` only at a valid client boundary; do not disable an entire page's server rendering for one browser widget.

#### 3.3 Bound server work and in-memory resources

- Combine controlled parallelism and `<Suspense>` with pagination, bounded batches, minimum DTO payloads, and measured concurrency. Never fan out an unbounded `Promise.all` across a whole dataset.
- Every in-memory cache/limiter Map has a TTL, entry/byte capacity, and eviction/sweep that actually removes expired entries even if a key is never read again. A live-entry count alone does not release retained memory.
- Singleton infrastructure must not hold actor, token, or request-specific data as mutable global state. Use a shared backend with atomic operations and TTL where multi-instance cache/limiter consistency is required.

#### 3.4 Use the appropriate media pipeline and page budget

- Use `next/image` for suitable raster images, with stable `width`/`height` or `fill`+`sizes`, correct aspect ratio and `alt`. SVG/icons, CSS backgrounds, video/audio, and authenticated media use the appropriate delivery pipeline.
- Compress/resize assets before upload, measure WebP/AVIF tradeoffs, lazy-load below-viewport media, and reserve preload/eager loading for important above-the-fold images using the installed API.
- Keep private Moodle media out of public optimizers/caches. Deliver it through an authenticated server boundary or an approved secure media service; browser URLs must not expose Moodle tokens. Enforce measured image/payload budgets per route.

#### 3.5 Colocate state and measure re-renders

- Keep state near its consumer and split context by responsibility/update frequency. Avoid multiple copies of large datasets or storing derived values that can be computed.
- Use React Profiler to identify costly re-renders before adding memoization or prop stabilization.
- Clean up timers, listeners, subscriptions, AbortControllers, and object URLs at the correct lifecycle boundary. Abort/ignore outdated requests so they cannot overwrite a newer filter, session, or tenant scope.

### 27.4 Rendering, database, Image configuration, and endpoint load

#### 4.1 Apply static rendering/ISR only to safe content

- Public content independent of session/cookies can use static rendering/ISR. For cached static output, source reads occur during build, cache miss, or revalidation rather than every cached HTML hit.
- Verify `next build` output and `next start` behavior; the presence of a `revalidate` export alone does not prove a route is static. Private data and access decisions remain request-time.

#### 4.2 Make cache policies explicit for the installed model

- Under the initial model without Cache Components, fetches are not automatically persisted in the Data Cache. Explicitly use eligible `next.revalidate`/tags or an appropriate cached-query adapter for safe data.
- Use `no-store` for private, security, transactional, and realtime reads, even when they change infrequently. Do not set `force-cache` globally or combine `no-store` with a positive `next.revalidate` on one fetch.
- A Cache Components migration changes eligible configuration/API choices; follow the installed guides rather than mixing incompatible examples from another version.

#### 4.3 Reuse the Prisma singleton and budget total connections

- Use `src/libs/prisma.ts` and its hot-reload-safe `globalThis` state. Do not create a PrismaClient or `pg.Pool` per request or add a second singleton.
- Prisma v7 with `@prisma/adapter-pg` uses the driver's `Pool.max`/`PG_POOL_MAX`; do not rely on the older Prisma v6 URL `connection_limit` parameter to limit this pool.
- Validate positive/ranged integer configuration for `PG_POOL_MAX`, `PG_IDLE_TIMEOUT_MS`, and `PG_CONN_TIMEOUT_MS`. Budget all application instances and workers together against database capacity with operational headroom.
- Do not disconnect/end the shared pool after each HTTP request. Cleanup belongs to shutdown or isolated CLI processes. Use selects, pagination, and batching to reduce oversized queries and N+1 behavior; preserve the SaaS/Moodle storage boundary.

#### 4.4 Restrict Image configuration and version stable media

- Replace all-internet `remotePatterns` hostname `"**"` with validated host/path/protocol allowlists. Multi-tenant Moodle sources need an approved registry/configuration or controlled media gateway; do not reopen arbitrary hosts. HTTP localhost is limited to development where needed.
- Select `deviceSizes`, `imageSizes`, and allowed qualities for the actual supported layouts/viewports; keep sufficient resolution for desktop and mobile.
- Increase `minimumCacheTTL` only for measured, stable public media with content-hashed/versioned URLs. Image cache is not invalidated by Next data tags/paths; changed media must change URL identity. Long public TTLs must not be applied to sensitive or frequently replaced media.

#### 4.5 Protect heavy endpoints and use durable queues for long jobs

- If added, `src/proxy.ts` supplies coarse rate limiting with a focused matcher. Keep endpoint/use-case authentication, RBAC, tenant, ownership checks, and the shared route limiter; proxy is not the sole access boundary.
- Use a shared atomic limiter for multi-instance deployments. Authenticated keys include tenant+actor+scope; anonymous/coarse IP limits trust only headers set by a controlled reverse proxy. Account for a school sharing one public IP.
- Use suitable limits for login, import/export, dispatch, monitoring, and attempt start/save/submit. Return 429 with `Retry-After`; legitimate autosave/submit must not lose answers due to a blanket threshold.
- Large import/export/dispatch work runs through a durable queue/outbox and worker. Reuse the existing notification outbox/worker, then verify atomic claims, leases, idempotency, concurrency, timeout, bounded retries/backoff, and access to results.
- Asynchronous job endpoints return 202 with job ID and an actor/tenant-protected status/result endpoint. Fire-and-forget, `setTimeout`, or `after()` is not a durable queue. Student save/submit success must confirm authoritative Moodle persistence rather than merely enqueueing work.

### Optimization verification and evidence

- Inventory the affected loaders/endpoints/mutations with data category, scope, TTL, keys/tags/paths, and refresh ownership before changing behavior.
- Follow section 15 for behavior changes. Meaningful regression coverage includes two users in one tenant, two tenants with identical Moodle parameters, private headers, post-commit invalidation, scope changes, partial failure, bounded cache/limiter cleanup, and concurrent worker claims.
- Verify cache/ISR/focus/navigation in production mode (`build` + `start`), including cold/warm caches. Preserve exam draft, timer, autosave, finished/expired-attempt behavior, and backend readiness restrictions.
- Apply section 24 and `npm run lint:barrel` (or the repository's current combined verify script). Check env configuration when it changes; never use a destructive database reset to validate an optimization.
- Attach reproducible before/after bundle/network/profiler evidence, request/query counts, relevant p50/p95 latency, heap/RSS, cache cardinality, and total pool usage. Record commit, environment, instance count, workload, and limitations; do not claim a gain without measurements.
- Update issue #151 only for implementation and tests that actually exist. A guidance-only PR does not close it. Document a rollback path for cache, pool, limiter, and worker behavior changes.

### Optimization references

Installed Next.js guides remain the first authority for framework behavior. When local docs are unavailable, establish the installed repository version before consulting these official references; report a blocker rather than inventing unsupported APIs.

- [Caching without Cache Components](https://nextjs.org/docs/app/guides/caching-without-cache-components) and [Cache Components](https://nextjs.org/docs/app/getting-started/cache-components)
- [revalidateTag](https://nextjs.org/docs/app/api-reference/functions/revalidateTag), [updateTag](https://nextjs.org/docs/app/api-reference/functions/updateTag), and [useRouter](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [staleTimes](https://nextjs.org/docs/app/api-reference/config/next-config-js/staleTimes), [Fetching data](https://nextjs.org/docs/app/getting-started/fetching-data), and [Backend for Frontend](https://nextjs.org/docs/app/guides/backend-for-frontend)
- [Image](https://nextjs.org/docs/app/api-reference/components/image), [Memory usage](https://nextjs.org/docs/app/guides/memory-usage), and [Proxy](https://nextjs.org/docs/app/api-reference/file-conventions/proxy)
- [Prisma v7 connection pool](https://www.prisma.io/docs/orm/v7/prisma-client/setup-and-configuration/databases-connections/connection-pool)
