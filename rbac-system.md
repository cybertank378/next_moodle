# RBAC SYSTEM — Admin / Tenant / Teacher / Student

## 1. Role

```ts
export enum AppRole {
  ADMIN = "ADMIN",
  TENANT = "TENANT",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}
```

- `ADMIN`: pengelola platform SaaS lintas tenant.
- `TENANT`: pengelola satu instansi/tenant; semua resource harus scoped ke session `tenantId`.
- `TEACHER`: pengajar dalam sebuah tenant; dapat membaca kursus, kuis, soal, nilai, dan memonitor ujian — tidak dapat manage user/enrolment atau membuat/menghapus ujian.
- `STUDENT`: peserta; hanya resource tenant sendiri dan own-resource attempt/result.

## 2. Page Boundary

```text
/dashboard/* → authenticated actor; akses fitur dibatasi role dan permission
```

Semua role menggunakan dashboard terpadu. Layout `(protected)` memvalidasi sesi dan
tenant context, sedangkan setiap halaman fitur mempertahankan guard role/permission
yang sesuai.

Guard dilakukan pada server layout dan tidak menggantikan API authorization.

## 3. Permission Matrix

| Capability | ADMIN | TENANT | TEACHER | STUDENT |
|---|---:|---:|---:|---:|
| Platform dashboard | ✓ | — | — | — |
| Create/update/suspend tenant | ✓ | — | — | — |
| Test tenant Moodle connection | ✓ | — | — | — |
| Platform audit | ✓ | — | — | — |
| Tenant dashboard | — | ✓ | — | — |
| Tenant branding | — | ✓ | — | — |
| User management | — | ✓ | — | — |
| Enrolment/group management | — | ✓ | — | — |
| Course read | — | ✓ | ✓ | own/enrolled |
| Quiz read | — | ✓ | ✓ | available/own tenant |
| Question bank CRUD | — | ✓ | read/create/update/delete | — |
| Exam create/update/delete | — | ✓ | — | — |
| Exam monitoring read | — | ✓ | ✓ | — |
| Exam monitoring action | — | ✓ | — | — |
| Grade read (class) | — | ✓ | ✓ | — |
| Grade read (own) | — | — | — | own only |
| Start/save/submit attempt | — | — | — | own only |
| Review attempt | — | — | — | own only + Moodle policy |
| Tenant audit | — | ✓ | — | — |

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
- TEACHER: `tenantId` wajib ada.
- STUDENT: `tenantId` wajib ada.
- TENANT/TEACHER/STUDENT tidak boleh mengganti tenant scope melalui request payload.

## 7. AuthMapper Detection Rule

```text
serviceUsed === "nextjs_admin" + isTeacherUsername || hasStaffCapabilities
  → AppRole.TEACHER

serviceUsed === "nextjs_admin" (no teacher signals)
  → AppRole.ADMIN

serviceUsed === "nextjs_tenant" || "nextjs_proctor"
  → AppRole.TENANT

serviceUsed === "nextjs_student" + isTeacherUsername || hasStaffCapabilities
  → AppRole.TEACHER

serviceUsed === "nextjs_student" (no teacher signals)
  → AppRole.STUDENT
```

## 8. No-Barrel Rule

RBAC files juga di-import langsung:

```ts
import { AppRole } from "@/core/rbac/AppRole";
import { Permission } from "@/core/rbac/Permission";
import { authorize } from "@/core/rbac/authorize";
```

Tidak dibuat `src/core/rbac/index.ts`.
