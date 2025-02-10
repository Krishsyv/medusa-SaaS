import * as bcrypt from "bcrypt";
import {
  createWorkflow,
  createStep,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules } from "@medusajs/framework/utils";

import {
  APP_ENTITY,
  APP_MODULE,
  linkDelete,
  linkEntities,
  RegisterAdminUserInput,
} from "src/constants";
import AdminUserService from "src/modules/admin_user/service";
import PortalService from "src/modules/portal/service";

enum WorkFlow {
  CREATE_ADMIN_USER = "create-admin_user",
  CREATE_USER = "create-user",
  CREATE_AUTH_AND_PROVIDER = "create-auth-and-provider",
  NAME = "register-admin-user-workflow",
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const createAdminUser = createStep(
  WorkFlow.CREATE_ADMIN_USER,
  async ({ portal_id, email, role }: RegisterAdminUserInput, { container }) => {
    try {
      const adminUserService: AdminUserService = container.resolve(
        APP_MODULE.ADMIN_USER
      );
      const portalService: PortalService = container.resolve(APP_MODULE.PORTAL);
      const get_portal = await portalService.listPortals({ portal_id });
      if (!get_portal.length) {
        return StepResponse.permanentFailure("Invalid Portal Id");
      }

      const get_admin_user = await adminUserService.listAdminUsers({
        email,
        portal_id,
      });
      if (!!get_admin_user.length) {
        return StepResponse.permanentFailure(
          `Admin with this ${email} already exist in this portal`
        );
      }
      const create_admin_user = await adminUserService.createAdminUsers({
        portal_id,
        email,
        role,
      });

      return new StepResponse(create_admin_user, create_admin_user.id);
    } catch (error) {
      return StepResponse.permanentFailure(
        `Admin creation failed: ${error.message}`,
        error
      );
    }
  },
  async (id: string, { container }) => {
    const adminUserService: AdminUserService = container.resolve(
      APP_MODULE.ADMIN_USER
    );
    await adminUserService.deleteAdminUsers(id);
  }
);

const createUserAndLink = createStep(
  WorkFlow.CREATE_USER,
  async (data: RegisterAdminUserInput, { container }) => {
    try {
      const { portal_id, email, first_name, last_name } = data;
      const userService = container.resolve(Modules.USER);
      const adminUserService: AdminUserService = container.resolve(
        APP_MODULE.ADMIN_USER
      );

      const [get_admin_user] = await adminUserService.listAdminUsers({
        portal_id,
        email,
      });

      const create_user = await userService.createUsers({
        email: get_admin_user.id,
        first_name,
        last_name,
      });

      await linkEntities(container, {
        first_entity: APP_ENTITY.admin_user,
        first_entity_id: get_admin_user.id,
        second_entity: Modules.USER,
        second_entity_id: create_user.id,
      });
      return new StepResponse(create_user, {
        user_id: create_user.id,
        admin_user_id: get_admin_user.id,
      });
    } catch (error) {
      return StepResponse.permanentFailure(
        `User creation failed ${error.message}`,
        error
      );
    }
  },
  async (
    { user_id, admin_user_id }: { user_id: string; admin_user_id: string },
    { container }
  ) => {
    const userService = container.resolve(Modules.USER);

    await linkDelete(container, {
      first_entity: APP_ENTITY.admin_user,
      first_entity_id: admin_user_id,
      second_entity: Modules.USER,
      second_entity_id: user_id,
    });

    await userService.deleteUsers(user_id);
  }
);

const createAuthAndProvider = createStep(
  WorkFlow.CREATE_AUTH_AND_PROVIDER,
  async (data: RegisterAdminUserInput, { container }) => {
    try {
      const authProviderService = container.resolve(Modules.AUTH);
      const userService = container.resolve(Modules.USER);
      const adminUserService: AdminUserService = container.resolve(
        APP_MODULE.ADMIN_USER
      );
      const password_hash = await hashPassword(data.password);
      // Creates record in auth_identity and provider_identity
      const register_admin_user = await authProviderService.register(
        APP_MODULE.APP_AUTH,
        {
          body: { ...data, password: password_hash },
        }
      );
      // get linked records from admin_user and user
      const [get_admin_user] = await adminUserService.listAdminUsers({
        portal_id: data.portal_id,
        email: data.email,
      });
      const [get_user] = await userService.listUsers({
        email: get_admin_user.id,
      });
      // Updates the app_metadata in the auth_identity(for valid token generation)
      const update_auth = await authProviderService.updateAuthIdentities({
        id: register_admin_user.authIdentity?.id as string,
        app_metadata: {
          user_id: get_user.id,
          portal_id: data.portal_id,
          email: data.email,
        },
      });

      const provider_id = register_admin_user.authIdentity?.provider_identities
        ? register_admin_user.authIdentity.provider_identities[0].id
        : "";

      return new StepResponse(
        { update_auth, register_admin_user },
        { auth_id: update_auth.id, provider_id }
      );
    } catch (error) {
      return StepResponse.permanentFailure(
        `Auth and Provider creation failed: ${error.message}`,
        error
      );
    }
  },
  async (
    { auth_id, provider_id }: { auth_id: string; provider_id: string },
    { container }
  ) => {
    try {
      const authService = container.resolve(Modules.AUTH);

      await authService.deleteProviderIdentities([provider_id]);
      await authService.deleteAuthIdentities([auth_id]);
    } catch (error) {
      return StepResponse.permanentFailure(
        `Auth and Provider cascade failed: ${error.message}`,
        error
      );
    }
  }
);

const registerAdminUserWorkflow = createWorkflow(
  WorkFlow.NAME,
  function (input: RegisterAdminUserInput) {
    try {
      //step: 1
      const create_admin_user = createAdminUser(input);
      //step: 2
      const create_user = createUserAndLink(input);
      //step: 3
      const { update_auth } = createAuthAndProvider(input);

      return new WorkflowResponse({
        admin_user_id: create_admin_user.id,
        user_id: create_user.id,
        auth_id: update_auth.id,
      });
    } catch (error) {
      return new WorkflowResponse(error);
    }
  }
);

export default registerAdminUserWorkflow;
