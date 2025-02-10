import { FormProvider, useForm } from "react-hook-form";
import { FormModal, TextInput } from "../../components";
import { usePatchData } from "../../lib/use_api";
import { useEffect } from "react";
import { IdKey, NameInput, CreateProps } from "../../shared";

type EditProps = {
  item: IdKey & NameInput;
} & CreateProps;

export const Edit = ({
  open,
  label,
  item,
  setOpen,
  heading,
  endpoint,
  queryKey,
}: EditProps) => {
  const formMethods = useForm({
    defaultValues: { id: item.id, name: item.name },
  });

  const update = usePatchData(
    queryKey,
    endpoint,
    `${label} updated successfully!`
  );

  const onSubmit = formMethods.handleSubmit((values: IdKey & NameInput) => {
    update.mutate({ id: values.id, data: { name: values.name } });
    setOpen(false);
    formMethods.reset();
  });

  useEffect(() => {
    formMethods.reset({ ...item });
  }, [item]);

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
          label="ID"
          name="id"
          disabled
          rules={{ required: "ID is required" }}
        />
        <TextInput
          label={label}
          name={"name"}
          placeholder={`Enter ${label}`}
          rules={{ required: `${label} name is required` }}
        />
      </FormModal>
    </FormProvider>
  );
};
