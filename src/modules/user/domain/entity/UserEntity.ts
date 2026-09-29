export class UserEntity {
  constructor(
    public readonly id: number,
    public readonly username: string,
    public readonly firstname: string,
    public readonly lastname: string,
    public readonly email: string,
    public readonly idnumber: string | null = null,
    public readonly department: string | null = null,
    public readonly institution: string | null = null,
    public readonly suspended: boolean = false,
    public readonly firstAccess: number | null = null,
    public readonly lastAccess: number | null = null,
    public readonly profileImageUrl: string | null = null,
  ) {}

  get fullname(): string {
    return `${this.firstname} ${this.lastname}`.trim();
  }

  get isActive(): boolean {
    return !this.suspended;
  }
}
