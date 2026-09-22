# RBAC SYSTEM — Admin / Tenant / Student

## 1. Role

```ts
export enum AppRole {
  ADMIN = "ADMIN",
  TENANT = "TENANT",
  STUDENT = "STUDENT",
}
```

- `ADMIN`: pengelola platform SaaS lintas tenant.
- `TENANT`: pengelola satu instansi/tenant; semua resource harus scoped ke session `tenantId`.
- `STUDENT`: peserta; hanya resource tenant sendiri dan own-resource attempt/result.

## 2. Page Boundary

```text
/admin/*    → ADMIN
/tenant/*   → TENANT
/student/*  → STUDENT
```

Guard dilakukan pada server layout dan tidak menggantikan API authorization.

## 3. Permission Matrix

| Capability | ADMIN | TENANT | STUDENT |
|---|---:|---:|---:|
| Platform dashboard | ✓ | — | — |
| Create/update/suspend tenant | ✓ | — | — |
| Test tenant Moodle connection | ✓ | — | — |
| Platform audit | ✓ | — | — |
| Tenant dashboard | — | ✓ | — |
| Tenant branding | — | ✓ | — |
| User management | — | ✓ | — |
| Enrolment/group management | — | ✓ | — |
| Course read | — | ✓ | own/enrolled |
| Quiz read | — | ✓ | available/own tenant |
| Question bank CRUD | — | ✓ | — |
| Exam administration | — | ✓ | — |
| Exam monitoring/action | — | ✓ | — |
| Grade read | — | tenant scoped | own only |
| Start/save/submit attempt | — | — | own only |
| Review attempt | — | — | own only + Moodle policy |

## 4. Enforcement Order

```text
Session validation
→ role validation
→ permission validation
→ tenant isolation
→ ownership/resource rule
→ use case
→ repository
```

## 5. Core Files

```text
src/core/rbac/AppRole.ts
src/core/rbac/Permission.ts
src/core/rbac/RolePermissionMap.ts
src/core/rbac/AuthorizationContext.ts
src/core/rbac/AuthorizationError.ts
src/core/rbac/authorize.ts
src/core/rbac/hasPermission.ts
src/core/rbac/requireRole.ts
src/core/rbac/requirePermission.ts
```

## 6. Actor Contract

```ts
export interface CurrentActor {
  readonly id: string;
  readonly role: AppRole;
  readonly tenantId: string | null;
  readonly moodleUserId: number | null;
  readonly permissions: readonly string[];
}
```

Rules:

- ADMIN: `tenantId` boleh null.
- TENANT: `tenantId` wajib ada.
- STUDENT: `tenantId` wajib ada.
- TENANT/STUDENT tidak boleh mengganti tenant scope melalui request payload.

## 7. No-Barrel Rule

RBAC files juga di-import langsung:

```ts
import { AppRole } from "@/core/rbac/AppRole";
import { Permission } from "@/core/rbac/Permission";
import { authorize } from "@/core/rbac/authorize";
```

Tidak dibuat `src/core/rbac/index.ts`.
