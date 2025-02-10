import * as bcrypt from "bcrypt";
import {
  AuthIdentityProviderService,
  AuthenticationInput,
  AuthenticationResponse,
} from "@medusajs/framework/types";
import {
  AbstractAuthModuleProvider,
  MedusaError,
} from "@medusajs/framework/utils";

import {
  APP_MODULE,
  RegisterStudentInput,
  RegisterAdminUserInput,
} from "src/constants";

class AppAuthServiceProvider extends AbstractAuthModuleProvider {
  static identifier = APP_MODULE.APP_AUTH;
  static DISPLAY_NAME = APP_MODULE.APP_AUTH;

  constructor() {
    super();
  }

  async authenticate(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { portal_id, student_enrollment_code, email, role, password } =
      data.body as RegisterStudentInput & RegisterAdminUserInput;
    try {
      const entity_id = role
        ? `${portal_id}|${email}`
        : `${portal_id}|${student_enrollment_code}`;
      const authIdentity = await authIdentityProviderService.retrieve({
        entity_id,
      });
      if (!authIdentity) {
        return { success: false, error: "Invalid credentials" };
      }

      const isMatch =
        authIdentity?.provider_identities &&
        (await bcrypt.compare(
          password,
          authIdentity.provider_identities[0]?.provider_metadata
            ?.password as string
        ));

      if (!isMatch) {
        return {
          success: false,
          error: "Invalid credentials",
        };
      }

      return { success: true, authIdentity };
    } catch (error) {
      return { success: true, error: "Invalid credentials" };
    }
  }

  async register(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ): Promise<AuthenticationResponse> {
    const { portal_id, student_enrollment_code, email, role, password } =
      data.body as RegisterStudentInput & RegisterAdminUserInput;
    const entity_id = role
      ? `${portal_id}|${email}`
      : `${portal_id}|${student_enrollment_code}`;
    try {
      await authIdentityProviderService.retrieve({ entity_id });
      return {
        success: false,
        error: role
          ? `User already exists with this email:${email} in this Portal:${portal_id}`
          : `User already exists with this Student Id:${student_enrollment_code} in this Portal:${portal_id}`,
      };
    } catch (error) {
      if (error.type === MedusaError.Types.NOT_FOUND) {
        const authIdentity = await authIdentityProviderService.create({
          entity_id,
          user_metadata: {
            portal_id,
            [role ? "email" : "student_enrollment_code"]: role
              ? email
              : student_enrollment_code,
          },
          provider_metadata: {
            password,
          },
        });

        return {
          success: true,
          authIdentity,
        };
      }
      return {
        success: false,
        error,
      };
    }
  }

  async resetPassword(
    data: AuthenticationInput,
    authIdentityProviderService: AuthIdentityProviderService
  ) {
    try {
      const { portal_id, student_enrollment_code, password } =
        data.body as RegisterStudentInput;
      const entity_id = `${portal_id}|${student_enrollment_code}`;
      const authIdentity = await authIdentityProviderService.retrieve({
        entity_id,
      });
      if (!authIdentity) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const hashedPassword = await this.hashPassword(password);

      await authIdentityProviderService.update(entity_id, {
        provider_metadata: {
          password: hashedPassword,
        },
      });

      return {
        success: true,
        authIdentity,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  // Custom methods
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }
}

export default AppAuthServiceProvider;
