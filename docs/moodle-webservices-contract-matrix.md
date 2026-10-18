# Moodle Web Services Contract Matrix & Standardization Audit

## 1. Executive Summary

- **Target Issue**: #201 - `[Audit][Moodle Web Services] Standardisasi seluruh kontrak local/examapi`
- **Plugin Audited**: `local_examapi` (Moodle Plugin v1.0.11-alpha, Version `2026101505`)
- **Plugin Location (Source)**: `D:\Project\Website\moodle_mod\local_examapi`
- **Plugin Location (Runtime)**: `D:\Project\Website\moodle.local\moodle\public\local\examapi`
- **Next.js Host**: `next_moodle` (BFF / Hexagonal Architecture)
- **Plugin PHP Test Suite**: 88/88 test suites PASSING (100% green).
- **Next.js Vitest Suite**: 172 test files, 870 unit & integration tests PASSING (100% green).

---

## 2. Built-in Service Boundaries & Token Roles

The Moodle backend plugin defines exactly four built-in services in `db/services.php`:

| Service Shortname | Target Application Role / Actor | Allowed Capabilities | Primary Responsibility |
|---|---|---|---|
| `nextjs_student` | `STUDENT` (Authenticated Student) | Student-scoped | Course viewing, quiz attempt lifecycle (start, save, process, review), own grades. |
| `nextjs_admin` | `TENANT` / `ADMIN` (Tenant Administrator) | `local/examapi:*`, core admin | User management, enrolments, cohort/group management, question bank CRUD, quiz composition. |
| `nextjs_proctor` | `TENANT` (Exam Proctoring) | `local/examapi:monitor` | Real-time exam monitoring, attempt intervention (lock, unlock, force finish, time extension). |
| `nextjs_teacher` | `TEACHER` (Course Instructor) | Teacher-scoped | Course/group management, question bank read, results viewing, grade viewing. |

> **Important Boundary Rule**: Under no circumstance may a service token crossing role boundaries take on operations forbidden to that role (e.g. Student cannot access Proctor or Admin functions; Proctor cannot start or save student attempts).

---

## 3. local_examapi Functions Inventory Matrix (38 Functions)

| # | Web Service Function | Class & Method | Capabilities / Context | Registered Services | Next.js Caller / Status |
|---|---|---|---|---|---|
| 1 | `local_examapi_add_group_members` | `local_examapi\external\add_group_members::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 2 | `local_examapi_add_question_to_quiz` | `local_examapi\external\add_question_to_quiz::execute` | local/examapi:managequizzes ($context) | nextjs_admin | _Not called directly_ |
| 3 | `local_examapi_add_random_questions` | `local_examapi\external\add_random_questions::execute` | local/examapi:managequizzes ($context) | nextjs_admin | _Not called directly_ |
| 4 | `local_examapi_create_course_group` | `local_examapi\external\create_course_group::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 5 | `local_examapi_create_question` | `local_examapi\external\create_question::execute` | local/examapi:managequestions ($context) | nextjs_admin | modules/questions/infrastructure/repo/MoodleQuestionRepository.ts |
| 6 | `local_examapi_create_question_category` | `local_examapi\external\create_question_category::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 7 | `local_examapi_delete_question` | `local_examapi\external\delete_question::execute` | local/examapi:managequestions ($context) | nextjs_admin | modules/questions/infrastructure/repo/MoodleQuestionRepository.ts |
| 8 | `local_examapi_delete_question_category` | `local_examapi\external\delete_question_category::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 9 | `local_examapi_duplicate_question` | `local_examapi\external\duplicate_question::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 10 | `local_examapi_extend_attempt_time` | `local_examapi\external\extend_attempt_time::execute` | local/examapi:manageattempts ($context) | nextjs_proctor | modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository.ts |
| 11 | `local_examapi_force_finish_attempt` | `local_examapi\external\force_finish_attempt::execute` | local/examapi:manageattempts ($context) | nextjs_proctor | modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository.ts |
| 12 | `local_examapi_get_api_version` | `local_examapi\external\get_api_version::execute` | local/examapi:view ($context) | nextjs_student, nextjs_admin, nextjs_proctor, nextjs_teacher | core/moodle/MoodlePreflight.ts<br>core/__tests__/moodle/MoodlePreflight.test.ts |
| 13 | `local_examapi_get_audit_logs` | `local_examapi\external\get_audit_logs::execute` | local/examapi:viewaudit ($context) | nextjs_admin | _Not called directly_ |
| 14 | `local_examapi_get_capabilities` | `local_examapi\external\get_capabilities::execute` | local/examapi:view ($context) | nextjs_student, nextjs_admin, nextjs_proctor, nextjs_teacher | core/moodle/MoodlePreflight.ts<br>core/__tests__/moodle/MoodlePreflight.test.ts<br>modules/auth/infrastructure/providers/MoodleDynamicAuthenticator.ts |
| 15 | `local_examapi_get_course_groups` | `local_examapi\external\get_course_groups::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 16 | `local_examapi_get_courses` | `local_examapi\external\get_courses::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | modules/course/infrastructure/repo/MoodleCourseRepository.ts<br>modules/course/__tests__/infrastructure/MoodleCourseRepository.test.ts |
| 17 | `local_examapi_get_exam_monitor` | `local_examapi\external\get_exam_monitor::execute` | local/examapi:monitor ($context) | nextjs_proctor | modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository.ts |
| 18 | `local_examapi_get_exam_results` | `local_examapi\external\get_exam_results::execute` | local/examapi:viewreports ($context) | nextjs_admin, nextjs_proctor, nextjs_teacher | _Not called directly_ |
| 19 | `local_examapi_get_exam_statistics` | `local_examapi\external\get_exam_statistics::execute` | local/examapi:viewreports ($context) | nextjs_admin, nextjs_proctor, nextjs_teacher | _Not called directly_ |
| 20 | `local_examapi_get_group_members` | `local_examapi\external\get_group_members::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 21 | `local_examapi_get_health` | `local_examapi\external\get_health::execute` | local/examapi:view ($context) | nextjs_student, nextjs_admin, nextjs_proctor, nextjs_teacher | core/moodle/MoodlePreflight.ts<br>core/__tests__/moodle/MoodlePreflight.test.ts<br>core/__tests__/moodle/MoodleRestClient.test.ts |
| 22 | `local_examapi_get_question` | `local_examapi\external\get_question::execute` | local/examapi:managequestions ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 23 | `local_examapi_get_question_categories` | `local_examapi\external\get_question_categories::execute` | local/examapi:managequestions ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 24 | `local_examapi_get_questions` | `local_examapi\external\get_questions::execute` | local/examapi:managequestions ($context) | nextjs_admin, nextjs_teacher | modules/questions/infrastructure/repo/MoodleQuestionRepository.ts |
| 25 | `local_examapi_get_quiz_questions` | `local_examapi\external\get_quiz_questions::execute` | local/examapi:managequizzes ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 26 | `local_examapi_get_quizzes` | `local_examapi\external\get_quizzes::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_proctor, nextjs_teacher | _Not called directly_ |
| 27 | `local_examapi_get_student_exam_result` | `local_examapi\external\get_student_exam_result::execute` | local/examapi:viewreports ($context) | nextjs_student, nextjs_teacher | _Not called directly_ |
| 28 | `local_examapi_get_tenant_context` | `local_examapi\external\get_tenant_context::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_proctor, nextjs_teacher | _Not called directly_ |
| 29 | `local_examapi_import_questions` | `local_examapi\external\import_questions::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 30 | `local_examapi_lock_attempt` | `local_examapi\external\lock_attempt::execute` | local/examapi:manageattempts ($context) | nextjs_proctor | core/__tests__/moodle/MoodleRestClient.test.ts<br>modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository.ts |
| 31 | `local_examapi_move_question` | `local_examapi\external\move_question::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 32 | `local_examapi_remove_group_members` | `local_examapi\external\remove_group_members::execute` | local/examapi:view ($context) | nextjs_admin, nextjs_teacher | _Not called directly_ |
| 33 | `local_examapi_remove_question_from_quiz` | `local_examapi\external\remove_question_from_quiz::execute` | local/examapi:managequizzes ($context) | nextjs_admin | _Not called directly_ |
| 34 | `local_examapi_reorder_quiz_questions` | `local_examapi\external\reorder_quiz_questions::execute` | local/examapi:managequizzes ($context) | nextjs_admin | modules/exam/infrastructure/repo/MoodleExamAdministrationRepository.ts |
| 35 | `local_examapi_unlock_attempt` | `local_examapi\external\unlock_attempt::execute` | local/examapi:manageattempts ($context) | nextjs_proctor | modules/exam-monitor/infrastructure/repo/MoodleExamMonitorRepository.ts |
| 36 | `local_examapi_update_question` | `local_examapi\external\update_question::execute` | local/examapi:managequestions ($context) | nextjs_admin | modules/questions/infrastructure/repo/MoodleQuestionRepository.ts |
| 37 | `local_examapi_update_question_category` | `local_examapi\external\update_question_category::execute` | local/examapi:managequestions ($context) | nextjs_admin | _Not called directly_ |
| 38 | `local_examapi_validate_user_tenant` | `local_examapi\external\validate_user_tenant::execute` | local/examapi:view ($context) | nextjs_student, nextjs_admin | _Not called directly_ |

---

## 4. Detailed Specification of All 38 local_examapi Functions

### 4.1 `local_examapi_add_group_members`

- **Description**: External function to batch add members to a course group (Issue 51).
- **PHP Class**: `local_examapi\external\add_group_members`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseid` | `PARAM_INT` | **Yes** | - | Course ID |
| `groupid` | `PARAM_INT` | **Yes** | - | Group ID |
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'True if all members were added or already members'), 'added_count' => value(PARAM_INT, 'Total successfully added or existing members'), 'added_userids' => list( value(PARAM_INT, 'Successfully added or existing user ID') ), 'failed' => list( struct([ 'userid' => value(PARAM_INT, 'Failed user ID'), 'reason' => value(PARAM_TEXT, 'Failure diagnostic reason'), ]) ), ]);
```

### 4.2 `local_examapi_add_question_to_quiz`

- **Description**: External function to attach a question to a quiz ([M5-07]).
- **PHP Class**: `local_examapi\external\add_question_to_quiz`
- **Capabilities Required**: `local/examapi:managequizzes`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Target quiz ID |
| `questionid` | `PARAM_INT` | **Yes** | - | Question bank question ID |
| `page` | `PARAM_INT` | No | `1` | Quiz page number (default 1) |
| `maxmark` | `PARAM_FLOAT` | No | `1.0` | Max mark weight for this slot (default 1.0) |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Created slot ID'), 'quizid' => value(PARAM_INT, 'Quiz ID'), 'slot' => value(PARAM_INT, 'Allocated slot number'), 'page' => value(PARAM_INT, 'Page number'), 'questionid' => value(PARAM_INT, 'Attached question ID'), 'maxmark' => value(PARAM_FLOAT, 'Max mark weight'), 'is_random' => value(PARAM_BOOL, 'Random slot flag (false)'), ]);
```

### 4.3 `local_examapi_add_random_questions`

- **Description**: External function to add a random question pool slot to a quiz ([M5-07]).
- **PHP Class**: `local_examapi\external\add_random_questions`
- **Capabilities Required**: `local/examapi:managequizzes`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Target quiz ID |
| `categoryid` | `PARAM_INT` | **Yes** | - | Question bank category ID for random selection |
| `randomcount` | `PARAM_INT` | No | `1` | Number of random questions to draw (default 1) |
| `includesubcategories` | `PARAM_BOOL` | No | `false` | Include questions from child subcategories |
| `page` | `PARAM_INT` | No | `1` | Page number (default 1) |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Created random slot record ID'), 'quizid' => value(PARAM_INT, 'Quiz ID'), 'slot' => value(PARAM_INT, 'Allocated slot number'), 'page' => value(PARAM_INT, 'Page number'), 'questionid' => value(PARAM_INT, 'Question ID (0 for random slot)'), 'is_random' => value(PARAM_BOOL, 'Random slot indicator (true)'), 'random_categoryid' => value(PARAM_INT, 'Source category ID for random pool'), 'random_includesubcategories' => value(PARAM_BOOL, 'Include subcategories flag'), ]);
```

### 4.4 `local_examapi_create_course_group`

- **Description**: External function to create a course group (Issue 51).
- **PHP Class**: `local_examapi\external\create_course_group`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseid` | `PARAM_INT` | **Yes** | - | Course ID |
| `name` | `PARAM_TEXT` | **Yes** | - | Group name |
| `description` | `PARAM_RAW` | No | `''` | Group description text or HTML |
| `idnumber` | `PARAM_RAW` | No | `''` | Group ID number or code |
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Group ID'), 'courseid' => value(PARAM_INT, 'Course ID'), 'name' => value(PARAM_TEXT, 'Group name'), 'idnumber' => value(PARAM_RAW, 'Group ID number'), 'description' => value(PARAM_RAW, 'Group description'), 'descriptionformat' => value(PARAM_INT, 'Description format'), 'membercount' => value(PARAM_INT, 'Total number of members in group'), 'timecreated' => value(PARAM_INT, 'Time created timestamp'), 'timemodified' => value(PARAM_INT, 'Time modified timestamp'), ]);
```

### 4.5 `local_examapi_create_question`

- **Description**: External function to create a new question with qtype validation ([M4-08]).
- **PHP Class**: `local_examapi\external\create_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `categoryid` | `PARAM_INT` | **Yes** | - | Category ID |
| `qtype` | `PARAM_ALPHANUMEXT` | **Yes** | - | Question type (multichoice, truefalse, shortanswer, numerical, etc.) |
| `name` | `PARAM_TEXT` | **Yes** | - | Question name |
| `questiontext` | `PARAM_TEXT` | **Yes** | - | Question prompt text |
| `defaultmark` | `PARAM_FLOAT` | No | `1.0` | Default mark (weight) |
| `generalfeedback` | `PARAM_TEXT` | No | `''` | General feedback |
| `options_json` | `PARAM_TEXT` | No | `'{}'` | QType specific options JSON payload |
| `status` | `PARAM_ALPHANUMEXT` | No | `'ready'` | Question status (ready/draft) |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Created question ID'), 'name' => value(PARAM_TEXT, 'Question name'), 'categoryid' => value(PARAM_INT, 'Category ID'), 'qtype' => value(PARAM_ALPHANUMEXT, 'Question type'), 'status' => value(PARAM_ALPHANUMEXT, 'Question status'), 'defaultmark' => value(PARAM_FLOAT, 'Default mark'), 'timecreated' => value(PARAM_INT, 'Created timestamp'), 'timemodified' => value(PARAM_INT, 'Modified timestamp'), 'version' => value(PARAM_INT, 'Question version'), ]);
```

### 4.6 `local_examapi_create_question_category`

- **Description**: External function to create a question category ([M4-07]).
- **PHP Class**: `local_examapi\external\create_question_category`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `name` | `PARAM_TEXT` | **Yes** | - | Category name |
| `contextid` | `PARAM_INT` | **Yes** | - | Context ID |
| `parent` | `PARAM_INT` | No | `0` | Parent category ID (0 for root) |
| `info` | `PARAM_TEXT` | No | `''` | Category description info |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Created category ID'), 'name' => value(PARAM_TEXT, 'Category name'), 'contextid' => value(PARAM_INT, 'Context ID'), 'parent' => value(PARAM_INT, 'Parent category ID'), 'info' => value(PARAM_TEXT, 'Category description info'), 'questioncount' => value(PARAM_INT, 'Question count (initialized to 0)'), ]);
```

### 4.7 `local_examapi_delete_question`

- **Description**: External function to delete a question ([M4-08]).
- **PHP Class**: `local_examapi\external\delete_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `questionid` | `PARAM_INT` | **Yes** | - | Question ID to delete |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Deletion success status'), 'questionid' => value(PARAM_INT, 'Deleted question ID'), ]);
```

### 4.8 `local_examapi_delete_question_category`

- **Description**: External function to delete a question category ([M4-07]).
- **PHP Class**: `local_examapi\external\delete_question_category`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `categoryid` | `PARAM_INT` | **Yes** | - | Category ID to delete |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Deletion success status'), 'categoryid' => value(PARAM_INT, 'Deleted category ID'), ]);
```

### 4.9 `local_examapi_duplicate_question`

- **Description**: External function to duplicate an existing question ([M4-08]).
- **PHP Class**: `local_examapi\external\duplicate_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `questionid` | `PARAM_INT` | **Yes** | - | Source question ID to duplicate |
| `newname` | `PARAM_TEXT` | No | `''` | Optional new name for duplicate |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'New duplicated question ID'), 'name' => value(PARAM_TEXT, 'Duplicated question name'), 'categoryid' => value(PARAM_INT, 'Category ID'), 'qtype' => value(PARAM_ALPHANUMEXT, 'Question type'), 'status' => value(PARAM_ALPHANUMEXT, 'Question status'), 'version' => value(PARAM_INT, 'Initialized version (1)'), ]);
```

### 4.10 `local_examapi_extend_attempt_time`

- **Description**: External function to extend active attempt time ([M8-06]).
- **PHP Class**: `local_examapi\external\extend_attempt_time`
- **Capabilities Required**: `local/examapi:manageattempts`
- **Context**: `$context`
- **Allowed Services**: `nextjs_proctor`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `attemptid` | `PARAM_INT` | **Yes** | - | Target attempt ID |
| `quizid` | `PARAM_INT` | No | `0` | Quiz ID |
| `userid` | `PARAM_INT` | No | `0` | Student user ID |
| `extraminutes` | `PARAM_INT` | **Yes** | - | Extra minutes to grant (1-180) |
| `reason` | `PARAM_TEXT` | **Yes** | - | Reason for time extension |

#### Returns:
```php
return struct([ 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'extraminutes' => value(PARAM_INT, 'Extra minutes granted'), 'extraseconds' => value(PARAM_INT, 'Extra seconds calculated'), 'extendedby' => value(PARAM_INT, 'Proctor user ID'), 'reason' => value(PARAM_TEXT, 'Reason string'), ]);
```

### 4.11 `local_examapi_force_finish_attempt`

- **Description**: External function to forcefully finish an attempt ([M8-04]).
- **PHP Class**: `local_examapi\external\force_finish_attempt`
- **Capabilities Required**: `local/examapi:manageattempts`
- **Context**: `$context`
- **Allowed Services**: `nextjs_proctor`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `attemptid` | `PARAM_INT` | **Yes** | - | Target attempt ID |
| `quizid` | `PARAM_INT` | No | `0` | Quiz ID |
| `userid` | `PARAM_INT` | No | `0` | Student user ID |
| `reason` | `PARAM_TEXT` | **Yes** | - | Reason for force finish |

#### Returns:
```php
return struct([ 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'state' => value(PARAM_ALPHANUMEXT, 'Resulting state (finished)'), 'timefinish' => value(PARAM_INT, 'Time finish timestamp'), 'forcefinishedby' => value(PARAM_INT, 'Proctor user ID'), 'reason' => value(PARAM_TEXT, 'Reason string'), ]);
```

### 4.12 `local_examapi_get_api_version`

- **Description**: External web service function for lightweight API version negotiation.
- **PHP Class**: `local_examapi\external\get_api_version`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
_No parameters required._

#### Returns:
```php
return struct([ 'component' => value(PARAM_COMPONENT, 'Safe component name (local_examapi)'), 'apiversion' => value(PARAM_INT, 'API major version number'), 'minclientversion' => value(PARAM_INT, 'Minimum supported client version'), 'status' => value(PARAM_ALPHANUMEXT, 'Negotiation status'), ]);
```

### 4.13 `local_examapi_get_audit_logs`

- **Description**: External function to get paginated audit logs ([M12-02]).
- **PHP Class**: `local_examapi\external\get_audit_logs`
- **Capabilities Required**: `local/examapi:viewaudit`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `action` | `PARAM_ALPHANUMEXT` | No | `null` | Filter by action name |
| `actorid` | `PARAM_INT` | No | `null` | Filter by operator user ID |
| `targetid` | `PARAM_INT` | No | `null` | Filter by target user ID |
| `quizid` | `PARAM_INT` | No | `null` | Filter by quiz ID |
| `page` | `PARAM_INT` | No | `1` | Page number (default 1) |
| `limit` | `PARAM_INT` | No | `50` | Items per page (default 50) |

#### Returns:
```php
return struct([ 'page' => value(PARAM_INT, 'Page number'), 'limit' => value(PARAM_INT, 'Items per page'), 'total' => value(PARAM_INT, 'Total matching records'), 'total_pages' => value(PARAM_INT, 'Total pages'), 'records' => list( struct([ 'id' => value(PARAM_INT, 'Log record ID'), 'action' => value(PARAM_ALPHANUMEXT, 'Action name'), 'actorid' => value(PARAM_INT, 'Operator user ID'), 'targetid' => value(PARAM_INT, 'Target user ID', VALUE_OPTIONAL), 'courseid' => value(PARAM_INT, 'Course ID', VALUE_OPTIONAL), 'quizid' => value(PARAM_INT, 'Quiz ID', VALUE_OPTIONAL), 'attemptid' => value(PARAM_INT, 'Attempt ID', VALUE_OPTIONAL), 'reason' => value(PARAM_TEXT, 'Operator reason', VALUE_OPTIONAL), 'correlationid' => value(PARAM_TEXT, 'Correlation UUID', VALUE_OPTIONAL), 'timecreated' => value(PARAM_INT, 'Creation timestamp'), 'status' => value(PARAM_ALPHANUMEXT, 'Operation status'), ]) ), ]);
```

### 4.14 `local_examapi_get_capabilities`

- **Description**: External web service function for safe capability and feature introspection.
- **PHP Class**: `local_examapi\external\get_capabilities`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
_No parameters required._

#### Returns:
```php
return struct([ 'can_view' => value(PARAM_BOOL, 'Caller has base view capability'), 'can_monitor' => value(PARAM_BOOL, 'Caller has live proctor monitor capability'), 'can_manage_attempts' => value(PARAM_BOOL, 'Caller has proctor attempt intervention capability'), 'can_view_reports' => value(PARAM_BOOL, 'Caller has exam results reporting capability'), 'can_manage' => value(PARAM_BOOL, 'Caller has administrative provisioning capability'), 'supported_features' => list( value(PARAM_ALPHANUMEXT, 'Feature flag token'), 'List of supported feature modules' ), ]);
```

### 4.15 `local_examapi_get_course_groups`

- **Description**: External function to get course groups with member counts (Issue 51).
- **PHP Class**: `local_examapi\external\get_course_groups`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseid` | `PARAM_INT` | **Yes** | - | Course ID |
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'groups' => list( struct([ 'id' => value(PARAM_INT, 'Group ID'), 'courseid' => value(PARAM_INT, 'Course ID'), 'name' => value(PARAM_TEXT, 'Group name'), 'idnumber' => value(PARAM_RAW, 'Group ID number'), 'description' => value(PARAM_RAW, 'Group description'), 'descriptionformat' => value(PARAM_INT, 'Description format'), 'membercount' => value(PARAM_INT, 'Total number of members in group'), 'timecreated' => value(PARAM_INT, 'Time created timestamp'), 'timemodified' => value(PARAM_INT, 'Time modified timestamp'), ]) ), ]);
```

### 4.16 `local_examapi_get_courses`

- **Description**: Web service function to get courses strictly scoped to tenant root category (Issue 34, Section 4 & 9).
- **PHP Class**: `local_examapi\external\get_courses`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return list( struct([ 'id' => value(PARAM_INT, 'Course ID'), 'fullname' => value(PARAM_TEXT, 'Full course name'), 'shortname' => value(PARAM_TEXT, 'Short course name'), 'categoryid' => value(PARAM_INT, 'Category ID'), 'tenantkey' => value(PARAM_ALPHANUMEXT, 'Tenant key scope', VALUE_DEFAULT, ''), ]) );
```

### 4.17 `local_examapi_get_exam_monitor`

- **Description**: External function to get aggregate exam monitor snapshot ([M7-03]).
- **PHP Class**: `local_examapi\external\get_exam_monitor`
- **Capabilities Required**: `local/examapi:monitor`
- **Context**: `$context`
- **Allowed Services**: `nextjs_proctor`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Target quiz ID |
| `page` | `PARAM_INT` | No | `1` | Page number (default 1) |
| `limit` | `PARAM_INT` | No | `50` | Items per page (default 50) |

#### Returns:
```php
return struct([ 'quizid' => value(PARAM_INT, 'Quiz ID'), 'courseid' => value(PARAM_INT, 'Course ID'), 'name' => value(PARAM_TEXT, 'Quiz name'), 'counters' => struct([ 'total_enrolled' => value(PARAM_INT, 'Enrolled count'), 'not_started' => value(PARAM_INT, 'Not started count'), 'in_progress' => value(PARAM_INT, 'In progress count'), 'finished' => value(PARAM_INT, 'Finished count'), 'overdue' => value(PARAM_INT, 'Overdue count'), 'locked' => value(PARAM_INT, 'Locked count'), ]), 'participants' => list( struct([ 'userid' => value(PARAM_INT, 'User ID'), 'fullname' => value(PARAM_TEXT, 'Student name'), 'attemptid' => value(PARAM_INT, 'Attempt ID', VALUE_OPTIONAL), 'attempt_number' => value(PARAM_INT, 'Attempt number'), 'state' => value(PARAM_ALPHANUMEXT, 'Attempt state'), 'timestart' => value(PARAM_INT, 'Time start'), 'timefinish' => value(PARAM_INT, 'Time finish'), 'timeleft_seconds' => value(PARAM_INT, 'Time left'), 'currentpage' => value(PARAM_INT, 'Current page'), 'is_locked' => value(PARAM_INT, 'Is locked boolean (1/0)'), 'incidentref' => value(PARAM_TEXT, 'Incident ref', VALUE_OPTIONAL), ]) ), 'page' => value(PARAM_INT, 'Current page'), 'limit' => value(PARAM_INT, 'Page limit'), 'total_pages' => value(PARAM_INT, 'Total pages'), 'timestamp' => value(PARAM_INT, 'Server timestamp'), ]);
```

### 4.18 `local_examapi_get_exam_results`

- **Description**: External function to get paginated cohort exam results ([M10-02]).
- **PHP Class**: `local_examapi\external\get_exam_results`
- **Capabilities Required**: `local/examapi:viewreports`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |
| `page` | `PARAM_INT` | No | `1` | Page number (default 1) |
| `limit` | `PARAM_INT` | No | `50` | Items per page (default 50) |
| `group` | `PARAM_TEXT` | No | `null` | Filter by student group name |

#### Returns:
```php
return struct([ 'quizid' => value(PARAM_INT, 'Quiz ID'), 'page' => value(PARAM_INT, 'Page number'), 'limit' => value(PARAM_INT, 'Items per page'), 'total' => value(PARAM_INT, 'Total matching records'), 'total_pages' => value(PARAM_INT, 'Total pages'), 'results' => list( struct([ 'userid' => value(PARAM_INT, 'User ID'), 'fullname' => value(PARAM_TEXT, 'Full name'), 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'attempt_number' => value(PARAM_INT, 'Attempt sequence number'), 'state' => value(PARAM_ALPHANUMEXT, 'Attempt state'), 'started_at' => value(PARAM_INT, 'Start timestamp'), 'finished_at' => value(PARAM_INT, 'Finish timestamp'), 'duration_seconds' => value(PARAM_INT, 'Duration in seconds'), 'score' => value(PARAM_FLOAT, 'Achieved score', VALUE_OPTIONAL), 'max_score' => value(PARAM_FLOAT, 'Maximum score'), 'percentage' => value(PARAM_FLOAT, 'Normalized percentage', VALUE_OPTIONAL), 'grade_formatted' => value(PARAM_TEXT, 'Formatted grade string', VALUE_OPTIONAL), 'feedback' => value(PARAM_TEXT, 'Quiz feedback', VALUE_OPTIONAL), 'group_name' => value(PARAM_TEXT, 'Group name', VALUE_OPTIONAL), ]) ), ]);
```

### 4.19 `local_examapi_get_exam_statistics`

- **Description**: External function to get cohort exam statistics ([M10-03]).
- **PHP Class**: `local_examapi\external\get_exam_statistics`
- **Capabilities Required**: `local/examapi:viewreports`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |

#### Returns:
```php
return struct([ 'quizid' => value(PARAM_INT, 'Quiz ID'), 'courseid' => value(PARAM_INT, 'Course ID'), 'total_participants' => value(PARAM_INT, 'Total participants'), 'total_attempts' => value(PARAM_INT, 'Total attempts'), 'finished_attempts' => value(PARAM_INT, 'Finished attempts'), 'average_score' => value(PARAM_FLOAT, 'Average score'), 'highest_score' => value(PARAM_FLOAT, 'Highest score'), 'lowest_score' => value(PARAM_FLOAT, 'Lowest score'), 'median_score' => value(PARAM_FLOAT, 'Median score'), 'pass_count' => value(PARAM_INT, 'Pass count'), 'fail_count' => value(PARAM_INT, 'Fail count'), 'pass_percentage' => value(PARAM_FLOAT, 'Pass percentage'), 'calculated_at' => value(PARAM_INT, 'Calculated timestamp'), ]);
```

### 4.20 `local_examapi_get_group_members`

- **Description**: External function to get group members with profile details (Issue 51).
- **PHP Class**: `local_examapi\external\get_group_members`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseid` | `PARAM_INT` | **Yes** | - | Course ID |
| `groupid` | `PARAM_INT` | **Yes** | - | Group ID |
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'groupid' => value(PARAM_INT, 'Group ID'), 'total' => value(PARAM_INT, 'Total number of members in group'), 'members' => list( struct([ 'id' => value(PARAM_INT, 'User ID'), 'username' => value(PARAM_RAW, 'Username'), 'firstname' => value(PARAM_TEXT, 'First name'), 'lastname' => value(PARAM_TEXT, 'Last name'), 'email' => value(PARAM_RAW, 'Email address'), 'idnumber' => value(PARAM_RAW, 'User ID number'), ]) ), ]);
```

### 4.21 `local_examapi_get_health`

- **Description**: External web service function to inspect plugin health and API version.
- **PHP Class**: `local_examapi\external\get_health`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
_No parameters required._

#### Returns:
```php
/** * Define parameters for get_health (no parameters required). * * @return \external_function_parameters */ public static function execute_parameters(): \external_function_parameters { return new \external_function_parameters([]);
```

### 4.22 `local_examapi_get_question`

- **Description**: External function to get detailed question information ([M4-08]).
- **PHP Class**: `local_examapi\external\get_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `questionid` | `PARAM_INT` | **Yes** | - | Question ID |

#### Returns:
```php
return struct([ 'id' => value(PARAM_INT, 'Question ID'), 'name' => value(PARAM_TEXT, 'Question name'), 'categoryid' => value(PARAM_INT, 'Category ID'), 'contextid' => value(PARAM_INT, 'Context ID'), 'qtype' => value(PARAM_ALPHANUMEXT, 'Question type'), 'status' => value(PARAM_ALPHANUMEXT, 'Question status'), 'questiontext' => value(PARAM_TEXT, 'Question prompt text'), 'questiontextformat' => value(PARAM_INT, 'Format (HTML/plain)'), 'generalfeedback' => value(PARAM_TEXT, 'General feedback'), 'defaultmark' => value(PARAM_FLOAT, 'Default mark'), 'penalty' => value(PARAM_FLOAT, 'Penalty fraction'), 'options_json' => value(PARAM_TEXT, 'JSON encoded qtype options'), 'version' => value(PARAM_INT, 'Question version'), 'timemodified' => value(PARAM_INT, 'Last modified timestamp'), ]);
```

### 4.23 `local_examapi_get_question_categories`

- **Description**: External function to get question categories for a context ([M4-07]).
- **PHP Class**: `local_examapi\external\get_question_categories`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `contextid` | `PARAM_INT` | **Yes** | - | Context ID to list categories for |

#### Returns:
```php
return struct([ 'contextid' => value(PARAM_INT, 'Context ID'), 'total' => value(PARAM_INT, 'Total categories found'), 'categories' => list( struct([ 'id' => value(PARAM_INT, 'Category ID'), 'name' => value(PARAM_TEXT, 'Category name'), 'contextid' => value(PARAM_INT, 'Context ID'), 'parent' => value(PARAM_INT, 'Parent category ID'), 'info' => value(PARAM_TEXT, 'Category description'), 'questioncount' => value(PARAM_INT, 'Number of questions in category'), ]) ), ]);
```

### 4.24 `local_examapi_get_questions`

- **Description**: External function to get paginated questions list with filters ([M4-08]).
- **PHP Class**: `local_examapi\external\get_questions`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `categoryid` | `PARAM_INT` | No | `0` | Category ID filter |
| `qtype` | `PARAM_ALPHANUMEXT` | No | `''` | Question type filter |
| `status` | `PARAM_ALPHANUMEXT` | No | `''` | Question status filter (ready/draft) |
| `search` | `PARAM_TEXT` | No | `''` | Search text keyword |
| `page` | `PARAM_INT` | No | `1` | Page number (default 1) |
| `limit` | `PARAM_INT` | No | `20` | Items per page (default 20) |

#### Returns:
```php
return struct([ 'total' => value(PARAM_INT, 'Total matching questions'), 'page' => value(PARAM_INT, 'Current page'), 'limit' => value(PARAM_INT, 'Items per page'), 'questions' => list( struct([ 'id' => value(PARAM_INT, 'Question ID'), 'name' => value(PARAM_TEXT, 'Question name'), 'categoryid' => value(PARAM_INT, 'Category ID'), 'qtype' => value(PARAM_ALPHANUMEXT, 'Question type'), 'status' => value(PARAM_ALPHANUMEXT, 'Status (ready/draft)'), 'defaultmark' => value(PARAM_FLOAT, 'Default mark'), 'timecreated' => value(PARAM_INT, 'Created timestamp'), 'timemodified' => value(PARAM_INT, 'Modified timestamp'), 'version' => value(PARAM_INT, 'Question version'), ]) ), ]);
```

### 4.25 `local_examapi_get_quiz_questions`

- **Description**: External function to get question slots belonging to a quiz ([M5-07]).
- **PHP Class**: `local_examapi\external\get_quiz_questions`
- **Capabilities Required**: `local/examapi:managequizzes`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |

#### Returns:
```php
return struct([ 'quizid' => value(PARAM_INT, 'Quiz ID'), 'total_slots' => value(PARAM_INT, 'Total question slots in quiz'), 'slots' => list( struct([ 'id' => value(PARAM_INT, 'Slot record ID'), 'quizid' => value(PARAM_INT, 'Quiz ID'), 'slot' => value(PARAM_INT, 'Sequential slot order number'), 'page' => value(PARAM_INT, 'Page number'), 'questionid' => value(PARAM_INT, 'Target question ID'), 'questionname' => value(PARAM_TEXT, 'Question name'), 'qtype' => value(PARAM_ALPHANUMEXT, 'Question type'), 'maxmark' => value(PARAM_FLOAT, 'Max mark for slot'), 'is_random' => value(PARAM_BOOL, 'Random slot flag'), 'version' => value(PARAM_INT, 'Pinned question version', VALUE_OPTIONAL), ]) ), ]);
```

### 4.26 `local_examapi_get_quizzes`

- **Description**: Web service function to get quizzes strictly scoped to tenant (Issue 34, Section 4 & 9).
- **PHP Class**: `local_examapi\external\get_quizzes`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |
| `courseid` | `PARAM_INT` | No | `0` | Optional specific course ID filter |

#### Returns:
```php
return list( struct([ 'id' => value(PARAM_INT, 'Quiz ID'), 'course' => value(PARAM_INT, 'Course ID'), 'name' => value(PARAM_TEXT, 'Quiz activity name'), 'intro' => value(PARAM_TEXT, 'Quiz description', VALUE_DEFAULT, ''), 'timeopen' => value(PARAM_INT, 'Opening time timestamp'), 'timeclose' => value(PARAM_INT, 'Closing time timestamp'), 'timelimit' => value(PARAM_INT, 'Time limit in seconds'), 'tenantkey' => value(PARAM_ALPHANUMEXT, 'Tenant key scope', VALUE_DEFAULT, ''), ]) );
```

### 4.27 `local_examapi_get_student_exam_result`

- **Description**: External function to get student exam result ([M10-02]).
- **PHP Class**: `local_examapi\external\get_student_exam_result`
- **Capabilities Required**: `local/examapi:viewreports`
- **Context**: `$context`
- **Allowed Services**: `nextjs_student`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |
| `userid` | `PARAM_INT` | **Yes** | - | User ID |

#### Returns:
```php
return struct([ 'userid' => value(PARAM_INT, 'User ID'), 'fullname' => value(PARAM_TEXT, 'Full name'), 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'attempt_number' => value(PARAM_INT, 'Attempt sequence number'), 'state' => value(PARAM_ALPHANUMEXT, 'Attempt state'), 'started_at' => value(PARAM_INT, 'Start timestamp'), 'finished_at' => value(PARAM_INT, 'Finish timestamp'), 'duration_seconds' => value(PARAM_INT, 'Duration in seconds'), 'score' => value(PARAM_FLOAT, 'Achieved score', VALUE_OPTIONAL), 'max_score' => value(PARAM_FLOAT, 'Maximum score'), 'percentage' => value(PARAM_FLOAT, 'Normalized percentage', VALUE_OPTIONAL), 'grade_formatted' => value(PARAM_TEXT, 'Formatted grade string', VALUE_OPTIONAL), 'feedback' => value(PARAM_TEXT, 'Quiz feedback', VALUE_OPTIONAL), 'group_name' => value(PARAM_TEXT, 'Group name', VALUE_OPTIONAL), ]);
```

### 4.28 `local_examapi_get_tenant_context`

- **Description**: Web service function to retrieve tenant context and root category mapping (Issue 34).
- **PHP Class**: `local_examapi\external\get_tenant_context`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'tenantkey' => value(PARAM_ALPHANUMEXT, 'Tenant identifier slug'), 'name' => value(PARAM_TEXT, 'Tenant display name'), 'categoryid' => value(PARAM_INT, 'Root course category ID'), 'cohortid' => value(PARAM_INT, 'Optional tenant cohort ID'), 'status' => value(PARAM_ALPHANUMEXT, 'Operational status: active, suspended, inactive'), 'tenantisolation' => value(PARAM_BOOL, 'Multi-tenant isolation status'), ]);
```

### 4.29 `local_examapi_import_questions`

- **Description**: External function for bulk question import with granular row diagnostics ([M4-09]).
- **PHP Class**: `local_examapi\external\import_questions`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `categoryid` | `PARAM_INT` | **Yes** | - | Destination category ID |
| `format` | `PARAM_ALPHANUMEXT` | No | `'json'` | Import format (e.g. json) |
| `payload` | `PARAM_TEXT` | **Yes** | - | Serialized questions payload |
| `dryrun` | `PARAM_BOOL` | No | `false` | Validate only without persisting |

#### Returns:
```php
return struct([ 'processed' => value(PARAM_INT, 'Total questions processed'), 'success' => value(PARAM_INT, 'Total successful imports'), 'failed' => value(PARAM_INT, 'Total failed imports'), 'warnings' => value(PARAM_INT, 'Total warnings'), 'total_rows' => value(PARAM_INT, 'Total rows in batch'), 'success_count' => value(PARAM_INT, 'Success count alias'), 'failed_count' => value(PARAM_INT, 'Failed count alias'), 'warning_count' => value(PARAM_INT, 'Warning count alias'), 'dry_run' => value(PARAM_BOOL, 'Dry run execution flag'), 'items' => list( struct([ 'row' => value(PARAM_INT, 'Item sequence index / row'), 'name' => value(PARAM_TEXT, 'Question item name'), 'status' => value(PARAM_ALPHANUMEXT, 'Import status (success/failed/dry_run_valid)'), 'questionid' => value(PARAM_INT, 'Created question ID (0 if failed or dry run)'), 'code' => value(PARAM_ALPHANUMEXT, 'Diagnostic error or status code'), 'message' => value(PARAM_TEXT, 'Diagnostic message'), ]) ), ]);
```

### 4.30 `local_examapi_lock_attempt`

- **Description**: External function to lock an active quiz attempt ([M8-02]).
- **PHP Class**: `local_examapi\external\lock_attempt`
- **Capabilities Required**: `local/examapi:manageattempts`
- **Context**: `$context`
- **Allowed Services**: `nextjs_proctor`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `attemptid` | `PARAM_INT` | **Yes** | - | Target attempt ID |
| `quizid` | `PARAM_INT` | No | `0` | Quiz ID |
| `userid` | `PARAM_INT` | No | `0` | Student user ID |
| `reason` | `PARAM_TEXT` | **Yes** | - | Reason for intervention lock |
| `incidentref` | `PARAM_TEXT` | No | `null` | External incident UUID |

#### Returns:
```php
return struct([ 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'status' => value(PARAM_ALPHANUMEXT, 'Lock status (locked)'), 'timelocked' => value(PARAM_INT, 'Lock timestamp'), 'lockedby' => value(PARAM_INT, 'Proctor user ID'), 'lockreason' => value(PARAM_TEXT, 'Lock reason'), 'incidentref' => value(PARAM_TEXT, 'Incident reference', VALUE_OPTIONAL), ]);
```

### 4.31 `local_examapi_move_question`

- **Description**: External function to move a question to another category ([M4-08]).
- **PHP Class**: `local_examapi\external\move_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `questionid` | `PARAM_INT` | **Yes** | - | Question ID to move |
| `targetcategoryid` | `PARAM_INT` | **Yes** | - | Destination category ID |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Operation success status'), 'questionid' => value(PARAM_INT, 'Question ID moved'), 'targetcategoryid' => value(PARAM_INT, 'Destination category ID'), ]);
```

### 4.32 `local_examapi_remove_group_members`

- **Description**: External function to batch remove members from a course group (Issue 51).
- **PHP Class**: `local_examapi\external\remove_group_members`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`, `nextjs_teacher`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `courseid` | `PARAM_INT` | **Yes** | - | Course ID |
| `groupid` | `PARAM_INT` | **Yes** | - | Group ID |
| `tenantkey` | `PARAM_ALPHANUMEXT` | No | `''` | Tenant identifier slug (optional, auto-resolved from token) |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'True if operation completed'), 'removed_count' => value(PARAM_INT, 'Total removed users'), 'removed_userids' => list( value(PARAM_INT, 'Removed user ID') ), ]);
```

### 4.33 `local_examapi_remove_question_from_quiz`

- **Description**: External function to remove a question slot from a quiz ([M5-07]).
- **PHP Class**: `local_examapi\external\remove_question_from_quiz`
- **Capabilities Required**: `local/examapi:managequizzes`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |
| `slotid` | `PARAM_INT` | **Yes** | - | Slot record ID to remove |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Removal success flag'), 'quizid' => value(PARAM_INT, 'Quiz ID'), 'slotid' => value(PARAM_INT, 'Removed slot ID'), ]);
```

### 4.34 `local_examapi_reorder_quiz_questions`

- **Description**: External function to reorder question slots in a quiz ([M5-07]).
- **PHP Class**: `local_examapi\external\reorder_quiz_questions`
- **Capabilities Required**: `local/examapi:managequizzes`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `quizid` | `PARAM_INT` | **Yes** | - | Quiz ID |
| `slotids_json` | `PARAM_TEXT` | **Yes** | - | JSON array of slot IDs in new sequential order |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Reordering success status'), 'quizid' => value(PARAM_INT, 'Quiz ID'), ]);
```

### 4.35 `local_examapi_unlock_attempt`

- **Description**: External function to unlock a locked quiz attempt ([M8-03]).
- **PHP Class**: `local_examapi\external\unlock_attempt`
- **Capabilities Required**: `local/examapi:manageattempts`
- **Context**: `$context`
- **Allowed Services**: `nextjs_proctor`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `attemptid` | `PARAM_INT` | **Yes** | - | Target attempt ID |
| `quizid` | `PARAM_INT` | No | `0` | Quiz ID |
| `reason` | `PARAM_TEXT` | **Yes** | - | Reason for unlocking |

#### Returns:
```php
return struct([ 'attemptid' => value(PARAM_INT, 'Attempt ID'), 'status' => value(PARAM_ALPHANUMEXT, 'Lock status (unlocked)'), 'timeunlocked' => value(PARAM_INT, 'Unlock timestamp'), 'unlockedby' => value(PARAM_INT, 'Proctor user ID'), 'unlockreason' => value(PARAM_TEXT, 'Unlock reason'), ]);
```

### 4.36 `local_examapi_update_question`

- **Description**: External function to update an existing question with OCC support ([M4-08], [M4-12]).
- **PHP Class**: `local_examapi\external\update_question`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `questionid` | `PARAM_INT` | **Yes** | - | Question ID to update |
| `name` | `PARAM_TEXT` | No | `''` | Question name |
| `questiontext` | `PARAM_TEXT` | No | `''` | Question prompt text |
| `defaultmark` | `PARAM_FLOAT` | No | `0.0` | Default mark |
| `generalfeedback` | `PARAM_TEXT` | No | `''` | General feedback |
| `options_json` | `PARAM_TEXT` | No | `''` | Options JSON payload |
| `status` | `PARAM_ALPHANUMEXT` | No | `''` | Question status (ready/draft) |
| `expected_timemodified` | `PARAM_INT` | No | `0` | OCC token (timemodified from last read) |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Update success flag'), 'questionid' => value(PARAM_INT, 'Updated question ID'), 'timemodified' => value(PARAM_INT, 'New timemodified token for OCC'), 'version' => value(PARAM_INT, 'New question version'), ]);
```

### 4.37 `local_examapi_update_question_category`

- **Description**: External function to update a question category ([M4-07]).
- **PHP Class**: `local_examapi\external\update_question_category`
- **Capabilities Required**: `local/examapi:managequestions`
- **Context**: `$context`
- **Allowed Services**: `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `categoryid` | `PARAM_INT` | **Yes** | - | Category ID to update |
| `name` | `PARAM_TEXT` | No | `null` | New category name |
| `info` | `PARAM_TEXT` | No | `null` | New category description |
| `parent` | `PARAM_INT` | No | `-1` | New parent category ID |

#### Returns:
```php
return struct([ 'success' => value(PARAM_BOOL, 'Operation success flag'), 'categoryid' => value(PARAM_INT, 'Category ID updated'), ]);
```

### 4.38 `local_examapi_validate_user_tenant`

- **Description**: Web service function to validate student/teacher user membership in tenant (Issue 34, Section 7 & 8).
- **PHP Class**: `local_examapi\external\validate_user_tenant`
- **Capabilities Required**: `local/examapi:view`
- **Context**: `$context`
- **Allowed Services**: `nextjs_student`, `nextjs_admin`

#### Parameters:
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| `tenantkey` | `PARAM_ALPHANUMEXT` | **Yes** | - | Unique tenant identifier |
| `userid` | `PARAM_INT` | **Yes** | - | User ID to validate against tenant scope |

#### Returns:
```php
return struct([ 'valid' => value(PARAM_BOOL, 'Whether the user belongs to the tenant'), 'tenantkey' => value(PARAM_ALPHANUMEXT, 'Tenant identifier'), 'userid' => value(PARAM_INT, 'User ID checked'), 'message' => value(PARAM_TEXT, 'Validation message or rejection details'), ]);
```


---

## 5. Core Moodle Functions Utilized by Next.js

| Core Web Service Function | Registered Services in db/services.php | Next.js Module Caller | Status & Audit Notes |
|---|---|---|---|
| `core_webservice_get_site_info` | `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher` | `modules/auth`, `modules/tenant` | Validated: Standard site and user profile info. |
| `core_user_get_users` | `nextjs_admin` | `modules/user` | Validated: Criteria-based tenant user search. |
| `core_user_get_users_by_field` | `nextjs_admin` | `modules/user` | Validated: Exact lookup by username, id, or email. |
| `core_user_create_users` | `nextjs_admin` | `modules/user` | Validated: Single and bulk student/teacher provisioning. |
| `core_user_update_users` | `nextjs_admin` | `modules/user` | Validated: Profile updates, password changes. |
| `core_course_get_courses` | `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher` | `modules/course` | Validated: Course catalog and details retrieval. |
| `core_course_get_categories` | `nextjs_admin`, `nextjs_teacher` | `modules/course` | Validated: Course category tree lookup. |
| `core_course_get_contents` | `nextjs_student`, `nextjs_admin`, `nextjs_teacher` | `modules/course` | **Fixed in Issue #201**: Added to `nextjs_student`, `nextjs_admin`, and `nextjs_teacher`. |
| `core_enrol_get_users_courses` | `nextjs_student`, `nextjs_teacher` | `modules/course` | Validated: User course enrollments list. |
| `core_enrol_get_enrolled_users` | `nextjs_student`, `nextjs_admin`, `nextjs_proctor`, `nextjs_teacher` | `modules/enrolment` | Validated: Enrolled user rosters per course. |
| `enrol_manual_enrol_users` | `nextjs_admin` | `modules/enrolment` | Validated: Manual course enrolment. |
| `enrol_manual_unenrol_users` | `nextjs_admin` | `modules/enrolment` | Validated: Manual course unenrolment. |
| `core_cohort_get_cohorts` | `nextjs_admin` | `modules/cohort` | Validated: Cohort listing. |
| `core_cohort_create_cohorts` | `nextjs_admin` | `modules/cohort` | Validated: Cohort creation. |
| `core_cohort_add_cohort_members` | `nextjs_admin` | `modules/cohort` | Validated: Cohort member assignment. |
| `core_cohort_delete_cohort_members` | `nextjs_admin` | `modules/cohort` | Validated: Cohort member removal. |
| `core_group_get_course_groups` | `nextjs_admin`, `nextjs_teacher` | `modules/group` | Validated: Group listing per course. |
| `core_group_create_groups` | `nextjs_admin` | `modules/group` | Validated: Group creation. |
| `core_group_add_group_members` | `nextjs_admin` | `modules/group` | Validated: Group membership addition. |
| `core_group_get_course_groupings` | `nextjs_admin`, `nextjs_teacher` | `modules/group` | Validated: Grouping listing. |
| `core_group_create_groupings` | `nextjs_admin` | `modules/group` | Validated: Grouping creation. |
| `core_group_assign_grouping` | `nextjs_admin` | `modules/group` | Validated: Assigning groups to groupings. |
| `core_calendar_get_calendar_events` | `nextjs_student` | `modules/calendar` | Validated: Student exam & assignment calendar events. |
| `core_calendar_get_action_events_by_timesort` | `nextjs_student` | `modules/calendar` | Validated: Chronologically sorted student action items. |
| `mod_quiz_get_quizzes_by_courses` | `nextjs_student`, `nextjs_teacher` | `modules/quiz` | Validated: Quiz metadata per course. |
| `mod_quiz_get_user_attempts` | `nextjs_student`, `nextjs_teacher` | `modules/quiz` | Validated: List of attempts for a user on a quiz. |
| `mod_quiz_get_combined_review_options` | `nextjs_student` | `modules/quiz` | Validated: Permissions on review states. |
| `mod_quiz_start_attempt` | `nextjs_student` | `modules/quiz` | Validated: Student-owned attempt initiation. |
| `mod_quiz_get_attempt_data` | `nextjs_student` | `modules/quiz` | Validated: Questions and current state for attempt. |
| `mod_quiz_get_attempt_summary` | `nextjs_student` | `modules/quiz` | Validated: Summary table before final submission. |
| `mod_quiz_save_attempt` | `nextjs_student` | `modules/quiz` | Validated: Autosave responses during exam. |
| `mod_quiz_process_attempt` | `nextjs_student` | `modules/quiz` | Validated: Final submit and finish attempt. |
| `mod_quiz_get_attempt_review` | `nextjs_student`, `nextjs_teacher` | `modules/quiz` | Validated: Post-attempt review data. |
| `mod_quiz_get_quiz_access_information` | `nextjs_student`, `nextjs_teacher` | `modules/quiz` | **Fixed in Issue #201**: Added to `nextjs_student` and `nextjs_teacher`. |
| `gradereport_user_get_grade_items` | `nextjs_student` | `modules/grades` | Validated: Student gradebook item view. |
| `core_grades_get_grades` | `nextjs_admin`, `nextjs_teacher` | `modules/grades` | **Fixed in Issue #201**: Added to `nextjs_admin` and `nextjs_teacher`. |
| `mod_assign_get_assignments` | `nextjs_student` | `modules/assignment` | Validated: Course assignments retrieval. |

---

## 6. Discrepancies Identified and Remediated in Issue #201

### 1. Attempt Intervention Parameter Contracts
- **Issue**: Next.js `MoodleExamMonitorRepository` called attempt intervention endpoints without required arguments or with mismatched keys:
  - `local_examapi_extend_attempt_time`: Next.js sent `extratimeminutes`, but Moodle expected `extraminutes` (`PARAM_INT`) and required `reason` (`PARAM_TEXT`).
  - `local_examapi_lock_attempt`: Next.js omitted required `reason` (`PARAM_TEXT`).
  - `local_examapi_unlock_attempt`: Next.js omitted required `reason` (`PARAM_TEXT`).
  - `local_examapi_force_finish_attempt`: Next.js omitted required `reason` (`PARAM_TEXT`).
- **Remediation**:
  - Updated `ExamMonitorActionRequestDto` to support an optional or default `reason` string.
  - Updated `MoodleExamMonitorRepository` to send `extraminutes` and include `reason` with fallback diagnostic text.
  - Added unit tests in `MoodleExamMonitorRepository.test.ts` verifying parameter shapes.

### 2. Quiz Question Reordering Contract
- **Issue**: `MoodleExamAdministrationRepository` sent `questions: JSON.stringify([{ questionid, slot }])`, whereas Moodle's `local_examapi_reorder_quiz_questions` expects `slotids_json: JSON.stringify([slotId1, slotId2, ...])`.
- **Remediation**:
  - Refactored repository to send `slotids_json` containing the sorted slot IDs.
  - Added unit tests in `MoodleExamAdministrationRepository.test.ts`.

### 3. Question Bank Serialization and Response Mapping
- **Issue**: `MoodleQuestionRepository` passed `options` directly (instead of `options_json` required by Moodle), and attempted to parse a flat array from `local_examapi_get_questions` (which returns an envelope object `{ total, page, limit, questions: [...] }`). Also mapped `category` instead of Moodle's returned `categoryid`.
- **Remediation**:
  - Updated create and update question calls to pass `options_json`.
  - Handled envelope responses flexibly in `getQuestionsByCategory`.
  - Corrected entity mapping from `categoryid` / `questionid`.
  - Added unit tests in `MoodleQuestionRepository.test.ts`.

### 4. Moodle Error Instantiation
- **Issue**: `new MoodleError("CODE")` sets `moodleErrorCode` to `"CODE"` and `message` defaults to generic `"Moodle upstream error"`.
- **Remediation**:
  - Standardized constructor calls to `new MoodleError("CODE", "Descriptive message")`.

### 5. Missing Core Functions in Built-In Services
- **Issue**: Next.js repositories called `core_course_get_contents`, `core_grades_get_grades`, and `mod_quiz_get_quiz_access_information`, but these core functions were missing from `db/services.php` in the plugin, causing token access rejections.
- **Remediation**:
  - Added the core functions to appropriate service boundaries in both `moodle_mod/local_examapi` and runtime `moodle.local/moodle/public/local/examapi`.
  - Verified with 88 passing PHP test suites and Vitest integration tests.

---

## 7. Verification Proof & Quality Gates

1. **Moodle Backend Test Suites**:
   - Command: `php scratch/run_all_tests.php`
   - Result: **88/88 test suites PASSING** (0 failures, 0 errors).
2. **Next.js Vitest Suites**:
   - Command: `npm test`
   - Result: **172 test files PASSING, 870 tests PASSING** (0 failures).
3. **TypeScript Strict Typecheck**:
   - Command: `npm run typecheck` (`tsc --noEmit`)
   - Result: **0 errors**.
4. **Architecture & Barrel Export Guardrail**:
   - Command: `npm run lint:barrel`
   - Result: **No barrel exports found**.
5. **Biome Linter & Formatter**:
   - Checked and formatted all touched files cleanly.
