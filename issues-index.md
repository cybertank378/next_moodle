# Sequential Issues — Next.js Exam SaaS

> Rule: **1 issue = 1 bounded engineering objective**.

Feature issue wajib mencakup vertical slice berikut dalam issue yang sama:

```text
src/modules/{feature}
src/sections/{feature}
src/app/api/{feature}
src/app/(protected)/dashboard/...
```

Foundation issue yang tidak memiliki business feature tidak dipaksa membuat module/section kosong.

| No. | File | Objective |
|---:|---|---|
| 01 | `issue.md` | Bootstrap & Architecture Guardrails |
| 02 | `issue2.md` | Core Foundation |
| 03 | `issue3.md` | RBAC & Public/Protected Route Boundary |
| 04 | `issue4.md` | Tenants — SaaS Metadata Management Vertical Slice |
| 05 | `issue5.md` | Moodle REST Adapter & Credential Security |
| 06 | `issue6.md` | Authentication, Session & Actor Resolution Vertical Slice |
| 07 | `issue7.md` | Protected Dashboard Foundation |
| 08 | `issue8.md` | Courses — Discovery & Detail Vertical Slice |
| 09 | `issue9.md` | Quizzes — Listing & Access Vertical Slice |
| 10 | `issue10.md` | Quiz Attempts — Student Exam Lifecycle Vertical Slice |
| 11 | `issue11.md` | Grades & Results Vertical Slice |
| 12 | `issue12.md` | Tenant Users Vertical Slice |
| 13 | `issue13.md` | Enrolments Vertical Slice |
| 14 | `issue14.md` | Groups & Cohorts Vertical Slice |
| 15 | `issue15.md` | Question Bank Vertical Slice |
| 16 | `issue16.md` | Exam Administration Vertical Slice |
| 17 | `issue17.md` | Exam Monitoring Vertical Slice |
| 18 | `issue18.md` | Tenant Branding Vertical Slice |
| 19 | `issue19.md` | Audit Vertical Slice |
| 20 | `issue20.md` | Security Hardening |
| 21 | `issue21.md` | Performance & Resilience |
| 22 | `issue22.md` | E2E, CI & Release Gate |
| 23 | `issue23.md` | Auth Module Structural Refactor |

## Execution Rule

```text
Issue aktif
  ↓
RED
  ↓
GREEN
  ↓
REFACTOR
  ↓
Acceptance Criteria + DoD
  ↓
Verification
  ↓
baru lanjut issue berikutnya
```
