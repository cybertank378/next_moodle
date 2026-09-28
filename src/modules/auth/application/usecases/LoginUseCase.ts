import { UnauthorizedError } from "@/core/errors/UnauthorizedError";
import { createLogger } from "@/core/logger/createLogger";
import type {
  IAuthRepository,
  IMoodleClient,
  LoginCredentials,
  TenantAuthResolver,
} from "@/modules/auth/domain/interfaces/AuthInterfaces";
import { mapMoodleUserToActor } from "@/modules/auth/domain/mapper/AuthMapper";
import { validateLoginRequest } from "@/modules/auth/domain/validators/AuthValidator";

export class LoginUseCase {
  private readonly logger = createLogger("LoginUseCase");

  constructor(
    private readonly tenantResolver: TenantAuthResolver,
    private readonly moodleClient: IMoodleClient,
    private readonly authRepository: IAuthRepository,
  ) {}

  async execute(input: LoginCredentials) {
    this.logger.info("Starting login process", {
      username: input.username,
      tenant: input.tenant,
    });
    const credentials = validateLoginRequest(input);
    const tenant = await this.tenantResolver.resolveLoginTenant(
      credentials.tenant,
    );
    this.logger.debug("Resolved tenant", { moodleUrl: tenant.moodleUrl });
    const moodleResult = await this.moodleClient.authenticateStudent({
      tenant,
      username: credentials.username,
      password: credentials.password,
    });
    this.logger.debug("Authenticated successfully with Moodle", {
      moodleUserId: moodleResult.siteInfo.userId,
      serviceUsed: moodleResult.serviceUsed,
    });

    if (
      moodleResult.siteInfo.username.toLowerCase() !==
      credentials.username.toLowerCase()
    ) {
      throw new UnauthorizedError(
        "Moodle identity does not match login username.",
      );
    }

    this.logger.info("Login successful, creating session", {
      username: credentials.username,
    });
    const actor = mapMoodleUserToActor(
      tenant,
      moodleResult.siteInfo,
      moodleResult.serviceUsed,
    );
    const session = await this.authRepository.createSession({
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
