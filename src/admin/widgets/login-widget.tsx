import { useEffect } from "react";
import { Button, toast } from "@medusajs/ui";
import { useNavigate } from "react-router-dom";
import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { FormProvider, useForm } from "react-hook-form";

import { TextInput } from "../components";
import { ENDPOINT, API_TYPE, login_fields } from "../shared";
import { sdk } from "../lib/sdk";

const LoginWidget = () => {
  const navigate = useNavigate();
  const formMethods = useForm({
    defaultValues: {
      portal_id: "",
      email: "",
      password: "",
      role: "admin",
    },
  });

  const handleSubmit = formMethods.handleSubmit(async (values) => {
    try {
      const data: { token?: string } = await sdk.client.fetch(ENDPOINT.login, {
        method: API_TYPE.POST,
        body: { ...values },
        headers: { "Content-Type": "application/json" },
      });
      if (data?.token) {
        await sdk.client.fetch(ENDPOINT.session, {
          method: API_TYPE.POST,
          body: { ...values },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${data.token}`,
          },
        });
        navigate("/orders");
      }
    } catch (error: any) {
      toast.error(error?.message || "Login Failed");
      console.log("error", error);
      return error;
    }
  });

  useEffect(() => {
    // Remove default form
    const forms = document.querySelectorAll("form");
    forms.forEach((form) => {
      if (form.id !== "app_auth_admin_form") {
        form.style.display = "none";
      }
      // Remove rest link
      document
        .querySelectorAll("span")
        .forEach((span) => (span.style.display = "none"));
      // Remove Medusa Logo
      document
        .querySelectorAll(".size-12.mb-4")
        .forEach((el: any) => (el.style.display = "none"));
      // Override heading text
      document.getElementsByTagName("h1")[0].textContent =
        "Welcome to Admin User";
    });
  }, []);

  return (
    <>
      <FormProvider {...formMethods}>
        <form id="app_auth_admin_form">
          {login_fields.map(({ label, name, rules, type }) => (
            <div className="mb-5" key={name}>
              <TextInput
                type={type}
                name={name}
                placeholder={`Enter ${label}`}
                rules={{ ...rules, required: `${label} is required` }}
              />
            </div>
          ))}
          <Button className="w-full mb-2" onClick={handleSubmit}>
            Login
          </Button>
        </form>
      </FormProvider>
    </>
  );
};

export const config = defineWidgetConfig({
  zone: "login.before",
});

export default LoginWidget;
