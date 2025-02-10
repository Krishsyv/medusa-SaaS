import { FormProvider, useForm } from "react-hook-form";
import { FormModal, TextInput } from "../../components";
import { usePostData } from "../../lib/use_api";
import { CreateProps } from "../../shared";

export const Create = ({
  open,
  label,
  setOpen,
  heading,
  endpoint,
  queryKey,
}: CreateProps) => {
  const formMethods = useForm({
    defaultValues: { name: "" },
  });

  const create = usePostData(
    queryKey,
    endpoint,
    `${label} created successfully!`
  );

  const onSubmit = formMethods.handleSubmit((values) => {
    create.mutate({ name: values.name });
    setOpen(false);
    formMethods.reset();
  });

  return (
    <FormProvider {...formMethods}>
      <FormModal
        submitTxt="Save"
        heading={`Create ${heading}`}
        open={open}
        setOpen={() => setOpen(!open)}
        onSave={onSubmit}
      >
        <TextInput
          label={label}
          name="name"
          placeholder={`Enter ${label}`}
          rules={{
            required: `${label} name is required`,
          }}
        />
      </FormModal>
    </FormProvider>
  );
};
