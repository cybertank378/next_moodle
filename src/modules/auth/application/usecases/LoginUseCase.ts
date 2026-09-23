import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import type {
  AuthSessionManager,
  LoginCredentials,
  MoodleAuthProvider,
  TenantAuthResolver,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";
import { mapMoodleStudentToActor } from "@/modules/auth/domain/mapper/AuthMapper";
import { validateLoginRequest } from "@/modules/auth/domain/validators/AuthValidator";

export class LoginUseCase {
  constructor(
    private readonly tenantResolver: TenantAuthResolver,
    private readonly moodleAuth: MoodleAuthProvider,
    private readonly sessionManager: AuthSessionManager,
  ) {}

  async execute(input: LoginCredentials) {
    const credentials = validateLoginRequest(input);
    const tenant = await this.tenantResolver.resolveLoginTenant(
      credentials.tenant,
    );
    const moodleResult = await this.moodleAuth.authenticateStudent({
      tenant,
      username: credentials.username,
      password: credentials.password,
    });

    if (
      moodleResult.siteInfo.username.toLowerCase() !==
      credentials.username.toLowerCase()
    ) {
      throw new UnauthorizedError(
        "Moodle identity does not match login username.",
      );
    }

    const actor = mapMoodleStudentToActor(tenant, moodleResult.siteInfo);
    const session = await this.sessionManager.createSession({
      actor,
      moodleToken: moodleResult.token,
    });

    return {
      actor,
      sessionCookie: {
        name: "session_token",
        value: session.cookieValue,
        expiresAt: session.expiresAt,
      },
    };
  }
}
