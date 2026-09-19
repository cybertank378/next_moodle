export interface LoginRequestDTO {
  readonly username: string;
  readonly password: string;
}

export interface LoginResponseDTO {
  readonly token: string;
  readonly user: {
    readonly id: string;
    readonly username: string;
    readonly fullName: string;
    readonly email: string;
    readonly roles: readonly string[];
  };
}

export interface CurrentUserResponseDTO {
  readonly id: string;
  readonly username: string;
  readonly fullName: string;
  readonly email: string;
  readonly tenantId: string;
  readonly roles: readonly string[];
}
