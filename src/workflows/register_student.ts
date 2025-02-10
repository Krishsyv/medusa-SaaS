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
  RegisterStudentInput,
} from "src/constants";
import AcademyService from "src/modules/academy/service";

enum WorkFlow {
  CREATE_STUDENT = "create-student",
  CREATE_CUSTOMER = "create-customer",
  CREATE_AUTH_AND_PROVIDER = "create-auth-and-provider",
  NAME = "register-student-workflow",
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
}

const createStudent = createStep(
  WorkFlow.CREATE_STUDENT,
  async (
    {
      portal_id,
      student_enrollment_code,
      email,
      first_name,
      last_name,
    }: RegisterStudentInput,
    { container }
  ) => {
    try {
      const academyService: AcademyService = container.resolve(
        APP_MODULE.ACADEMY
      );
      const get_student = await academyService.listStudents({
        email,
        portal_id,
        student_enrollment_code,
      });
      if (!!get_student.length) {
        return StepResponse.permanentFailure(
          `Student with ${student_enrollment_code}, ${email} already exist in this portal`
        );
      }
      const create_student = await academyService.createStudents({
        portal_id,
        student_enrollment_code,
        email,
        student_name: `${first_name} ${last_name}`,
      });

      return new StepResponse(create_student, create_student.id);
    } catch (error) {
      return StepResponse.permanentFailure(
        `Student creation failed: ${error.message}`,
        error
      );
    }
  },
  async (id: string, { container }) => {
    const academyService: AcademyService = container.resolve(
      APP_MODULE.ACADEMY
    );
    await academyService.deleteStudents(id);
  }
);

const createCustomerAndLink = createStep(
  WorkFlow.CREATE_CUSTOMER,
  async (data: RegisterStudentInput, { container }) => {
    try {
      const { first_name, last_name, portal_id, student_enrollment_code } =
        data;
      const customerService = container.resolve(Modules.CUSTOMER);
      const academyService: AcademyService = container.resolve(
        APP_MODULE.ACADEMY
      );

      const [get_student] = await academyService.listStudents({
        portal_id,
        student_enrollment_code,
      });

      const create_customer = await customerService.createCustomers({
        email: get_student.id,
        first_name,
        last_name,
      });

      await linkEntities(container, {
        first_entity: APP_ENTITY.student,
        first_entity_id: get_student.id,
        second_entity: Modules.CUSTOMER,
        second_entity_id: create_customer.id,
      });
      return new StepResponse(create_customer, {
        customer_id: create_customer.id,
        student_id: get_student.id,
      });
    } catch (error) {
      return StepResponse.permanentFailure(
        `Customer creation failed ${error.message}`,
        error
      );
    }
  },
  async (
    { customer_id, student_id }: { customer_id: string; student_id: string },
    { container }
  ) => {
    const customerService = container.resolve(Modules.CUSTOMER);

    await linkDelete(container, {
      first_entity: APP_ENTITY.student,
      first_entity_id: student_id,
      second_entity: Modules.CUSTOMER,
      second_entity_id: customer_id,
    });

    await customerService.deleteCustomers(customer_id);
  }
);

const createAuthAndProvider = createStep(
  WorkFlow.CREATE_AUTH_AND_PROVIDER,
  async (data: RegisterStudentInput, { container }) => {
    try {
      const authProviderService = container.resolve(Modules.AUTH);
      const customerService = container.resolve(Modules.CUSTOMER);
      const academyService: AcademyService = container.resolve(
        APP_MODULE.ACADEMY
      );
      const password_hash = await hashPassword(data.password);
      // Creates record in auth_identity and provider_identity
      const register_student = await authProviderService.register(
        APP_MODULE.APP_AUTH,
        {
          body: { ...data, password: password_hash },
        }
      );
      // get linked records from student and customer
      const [get_student] = await academyService.listStudents({
        portal_id: data.portal_id,
        student_enrollment_code: data.student_enrollment_code,
      });
      const [get_customer] = await customerService.listCustomers({
        email: get_student.id,
      });
      // Updates the app_metadata in the auth_identity(for valid token generation)
      const update_auth = await authProviderService.updateAuthIdentities({
        id: register_student.authIdentity?.id as string,
        app_metadata: {
          customer_id: get_customer.id,
          portal_id: data.portal_id,
          student_enrollment_code: data.student_enrollment_code,
        },
      });


      const provider_id = register_student.authIdentity?.provider_identities
        ? register_student.authIdentity.provider_identities[0].id
        : "";

      return new StepResponse(
        { update_auth, register_student },
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

const registerStudentWorkflow = createWorkflow(
  WorkFlow.NAME,
  function (input: RegisterStudentInput) {
    try {
      //step: 1
      const create_student = createStudent(input);
      //step: 2
      const create_customer = createCustomerAndLink(input);
      //step: 3
      const { update_auth } = createAuthAndProvider(input);

      return new WorkflowResponse({
        student_id: create_student.id,
        customer_id: create_customer.id,
        auth_id: update_auth.id,
      });
    } catch (error) {
      return new WorkflowResponse(error);
    }
  }
);

export default registerStudentWorkflow;
