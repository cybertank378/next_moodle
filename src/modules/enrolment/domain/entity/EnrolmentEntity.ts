import type { EnrolmentRoleDto } from "../dto/EnrolmentResponseDto";

export class EnrolmentEntity {
  constructor(
    public readonly id: number,
    public readonly userId: number,
    public readonly courseId: number,
    public readonly username: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly roles: EnrolmentRoleDto[] = [],
    public readonly timestart: number | null = null,
    public readonly timeend: number | null = null,
  ) {}

  get primaryRole(): string {
    return this.roles[0]?.name || "Student";
  }

  get isExpired(): boolean {
    if (!this.timeend) return false;
    return Date.now() / 1000 > this.timeend;
  }
}
