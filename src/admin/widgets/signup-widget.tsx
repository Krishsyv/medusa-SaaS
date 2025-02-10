import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Button } from "@medusajs/ui";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { FormModal, TextInput } from "../components";
import { usePostData } from "../lib/use_api";
import { QUERY_KEY, ENDPOINT, signup_fields } from "../shared";

const LoginWidget = () => {
  const [open, setOpen] = useState(false);
  const formMethods = useForm({
    defaultValues: {
      portal_id: "",
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      confirm_password: "",
      role: "admin",
    },
  });

  const create = usePostData(
    QUERY_KEY.register,
    ENDPOINT.register,
    "Admin created successfully!"
  );

  const handleSubmit = formMethods.handleSubmit((values) => {
    const { confirm_password, ...rest } = values;
    console.log(rest);
    create.mutate({ ...rest });
    setOpen(false);
    formMethods.reset();
  });

  return (
    <>
      <Button className="w-full" onClick={() => setOpen(true)}>
        Signup
      </Button>

      <FormProvider {...formMethods}>
        <FormModal
          submitTxt="Signup"
          heading="Create Admin Account"
          open={open}
          setOpen={() => setOpen(!open)}
          onSave={handleSubmit}
        >
          {signup_fields.map(({ label, name, rules, type }) => (
            <TextInput
              label={label}
							type={type}
              name={name}
              placeholder={`Enter ${label}`}
              rules={{ ...rules, required: `${label} is required` }}
            />
          ))}
        </FormModal>
      </FormProvider>
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "login.after",
});

export default LoginWidget;
