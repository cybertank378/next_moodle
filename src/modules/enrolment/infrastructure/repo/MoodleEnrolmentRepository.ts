import "server-only";

import type { MoodleClientFactory } from "@/core/moodle/MoodleClientFactory";
import type { MoodleClient } from "@/core/moodle/types";
import type {
  EnrolUserRequestDto,
  ListEnrolmentsQueryDto,
  UnenrolUserRequestDto,
} from "@/modules/enrolment/domain/dto/EnrolmentRequestDto";
import type {
  EnrolledUserResponseDto,
  EnrolmentListResponseDto,
} from "@/modules/enrolment/domain/dto/EnrolmentResponseDto";
import type { EnrolmentRepositoryInterface } from "@/modules/enrolment/domain/interfaces/EnrolmentRepositoryInterface";

interface RawMoodleEnrolledRole {
  roleid: number;
  name: string;
  shortname: string;
}

interface RawMoodleEnrolledUser {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  fullname: string;
  email: string;
  idnumber?: string;
  department?: string;
  roles?: RawMoodleEnrolledRole[];
  firstaccess?: number;
  lastaccess?: number;
  profileimageurl?: string;
}

export class MoodleEnrolmentRepository implements EnrolmentRepositoryInterface {
  constructor(
    private readonly clientFactory: MoodleClientFactory,
    private readonly clientOverride?: MoodleClient,
  ) {}

  private async resolveClient(
    tenantId: string,
    clientOverride?: MoodleClient,
  ): Promise<MoodleClient> {
    if (clientOverride) return clientOverride;
    if (this.clientOverride) return this.clientOverride;
    return this.clientFactory.createClientForTenant(
      { tenantId, tenantSlug: tenantId, status: "ACTIVE" },
      "admin",
    );
  }

  async getCourseEnrolments(input: {
    tenantId: string;
    query: ListEnrolmentsQueryDto;
    client?: MoodleClient;
  }): Promise<EnrolmentListResponseDto> {
    const client = await this.resolveClient(input.tenantId, input.client);

    const rawUsers = await client.call<RawMoodleEnrolledUser[]>(
      "core_enrol_get_enrolled_users",
      {
        courseid: input.query.courseId,
      },
    );

    let users = rawUsers ?? [];

    if (input.query.search && input.query.search.trim().length > 0) {
      const s = input.query.search.trim().toLowerCase();
      users = users.filter((u) => {
        return (
          u.username?.toLowerCase().includes(s) ||
          u.firstname?.toLowerCase().includes(s) ||
          u.lastname?.toLowerCase().includes(s) ||
          u.fullname?.toLowerCase().includes(s) ||
          u.email?.toLowerCase().includes(s) ||
          u.idnumber?.toLowerCase().includes(s)
        );
      });
    }

    const page = input.query.page ?? 1;
    const pageSize = input.query.pageSize ?? 20;
    const total = users.length;

    const startIndex = (page - 1) * pageSize;
    const paginated = users.slice(startIndex, startIndex + pageSize);

    const enrolments: EnrolledUserResponseDto[] = paginated.map((u) => ({
      id: u.id,
      userId: u.id,
      courseId: input.query.courseId,
      username: u.username,
      firstname: u.firstname,
      lastname: u.lastname,
      fullname: u.fullname || `${u.firstname} ${u.lastname}`.trim(),
      email: u.email,
      idnumber: u.idnumber ?? null,
      department: u.department ?? null,
      roles: (u.roles ?? []).map((r) => ({
        roleId: r.roleid,
        name: r.name,
        shortname: r.shortname,
      })),
      timestart: null,
      timeend: null,
      profileImageUrl: u.profileimageurl ?? null,
    }));

    return {
      enrolments,
      total,
      page,
      pageSize,
    };
  }

  async enrolUsers(input: {
    tenantId: string;
    enrolments: EnrolUserRequestDto[];
    client?: MoodleClient;
  }): Promise<boolean> {
    if (input.enrolments.length === 0) return true;
    const client = await this.resolveClient(input.tenantId, input.client);

    const moodlePayload = input.enrolments.map((e) => ({
      courseid: e.courseId,
      userid: e.userId,
      roleid: e.roleId ?? 5, // default to student (role id 5)
      timestart: e.timestart ?? 0,
      timeend: e.timeend ?? 0,
      suspend: 0,
    }));

    await client.call("enrol_manual_enrol_users", {
      enrolments: moodlePayload,
    });

    return true;
  }

  async unenrolUsers(input: {
    tenantId: string;
    enrolments: UnenrolUserRequestDto[];
    client?: MoodleClient;
  }): Promise<boolean> {
    if (input.enrolments.length === 0) return true;
    const client = await this.resolveClient(input.tenantId, input.client);

    const moodlePayload = input.enrolments.map((e) => ({
      courseid: e.courseId,
      userid: e.userId,
      ...(e.roleId ? { roleid: e.roleId } : {}),
    }));

    await client.call("enrol_manual_unenrol_users", {
      enrolments: moodlePayload,
    });

    return true;
  }
}
