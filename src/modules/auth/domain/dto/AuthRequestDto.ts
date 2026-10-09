export interface LoginRequestDto {
  readonly tenant: string;
  readonly username: string;
  readonly password: string;
  readonly service?: string;
}
