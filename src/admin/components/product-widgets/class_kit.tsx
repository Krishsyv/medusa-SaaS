import _ from "lodash";
import { Pencil } from "@medusajs/icons";
import { format } from "date-fns";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ENDPOINT,
  IdKey,
  ClassKitInput,
  QUERY_KEY,
  CreateProps,
  DefaultKeys,
  CLASS_KIT_TYPE,
  DEFAULT_KEYS,
  useMemoOptions,
  enumToOptions,
  statusOptions,
} from "../../shared";
import {
  Button,
  Container,
  createDataTableColumnHelper,
  Heading,
} from "@medusajs/ui";
import { DataTable } from "../data_table";
import { ActionMenu } from "../actions_menu";
import { usePostData, usePatchData, useGetData } from "../../lib/use_api";
import { FormModal, RenderForm, TextInput } from "../../components";

const columnHelper = createDataTableColumnHelper<
  IdKey & ClassKitInput & DefaultKeys
>();
const defaultColumnHelper = createDataTableColumnHelper();

enum ClassKit {
  id = "ID",
  kit_id = "Kit Id",
  class_id = "Class Id",
  type = "Type",
  is_customizable = "Is Customizable",
  second_language = "2nd Language",
  third_language = "3rd Language",
  third_language_status = "3rd Language Status",
  status = "Status",
}

export const ClassKitSection = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [item, setItem] = useState<IdKey & ClassKitInput>({
    id: "",
    kit_id: "",
    class_id: "",
    type: CLASS_KIT_TYPE.CLOSED,
    is_customizable: false,
    second_language: "",
    third_language: "",
    third_language_status: false,
    status: false,
  });

  const { data: productData, refetch: productsRefetch }: any = useGetData(
    QUERY_KEY.products,
    ENDPOINT.get_products
  );
  const { data: kitData, refetch: kitsRefetch }: any = useGetData(
    QUERY_KEY.kit,
    ENDPOINT.kit
  );
  const { data: classData, refetch: classRefetch }: any = useGetData(
    QUERY_KEY.classes,
    ENDPOINT.class
  );
  const { data: languageData, refetch: languagesRefetch }: any = useGetData(
    QUERY_KEY.languages,
    ENDPOINT.language
  );

  const actions = columnHelper.accessor("id", {
    header: "Actions",
    maxSize: 60,
    cell: ({ row }) => (
      <ActionMenu
        groups={[
          {
            actions: [
              {
                icon: <Pencil />,
                label: "Edit",
                onClick: () => onUpdate(row.original),
              },
            ],
          },
        ]}
      />
    ),
  });
  const columns = [
    ...generateColumns(_.merge({}, ClassKit, DEFAULT_KEYS)),
    actions,
  ];

  const onRefetch = () => {
    productsRefetch();
    kitsRefetch();
    classRefetch();
    languagesRefetch();
  };

  const onUpdate = (row: IdKey & ClassKitInput & DefaultKeys) => {
    onRefetch();
    setItem(_.omit(row, ["created_at", "updated_at"]));
    setOpenEdit(true);
  };

  const productOptions = useMemoOptions({
    data: productData?.products,
    custom: { labelProperty: "id", valueProperty: "id" },
  });
  const kitOptions = useMemoOptions({
    data: kitData?.list,
    custom: { labelProperty: "id", valueProperty: "id" },
  });
  const classOptions = useMemoOptions({ data: classData?.list });
  const languageOptions = useMemoOptions({ data: languageData?.list });

  const class_kit_fields = useMemo(
    () => [
      {
        type: "select",
        label: "Kit ID",
        name: "kit_id",
        options: kitOptions,
        rules: { required: "Kit ID is required" },
      },
      {
        type: "select",
        label: "Class",
        name: "class_id",
        options: classOptions,
        rules: { required: "Kit ID is required" },
      },
      {
        type: "select",
        label: "Type",
        name: "type",
        options: enumToOptions(CLASS_KIT_TYPE),
        rules: { required: "Type is required" },
      },
      {
        type: "select",
        label: "Is Customizable",
        name: "is_customizable",
        options: [
          { value: true, label: "Yes" },
          { value: false, label: "No" },
        ],
        rules: { required: "Is Customizable is required" },
      },
      {
        type: "select",
        label: "Second Language",
        name: "second_language",
        options: languageOptions,
        rules: { required: "Second Language is required" },
      },
      {
        type: "select",
        label: "Third Language",
        name: "third_language",
        options: languageOptions,
        rules: { required: "Third Language is required" },
      },
      {
        type: "select",
        label: "Third Language Status",
        name: "third_language_status",
        options: statusOptions,
        rules: { required: "Third Language Status is required" },
      },
      {
        type: "select",
        label: "Status",
        name: "status",
        options: statusOptions,
        rules: { required: "Status is required" },
      },
    ],
    [productOptions, kitOptions, classOptions, languageOptions]
  );

  return (
    <Container className="divide-x p-0 mb-5">
      <div className="flex flex-row items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading className="p-4">Class Kit</Heading>
        <Button
          onClick={() => setOpenCreate(true)}
          variant="secondary"
          className="mr-5"
        >
          Create
        </Button>
      </div>

      <DataTable
        limit={5}
        queryKey={QUERY_KEY.class_kit}
        endpoint={ENDPOINT.class_kit}
        columns={columns}
      />

      <Create
        label="Class Kit"
        open={openCreate}
        heading="Class Kit"
        setOpen={setOpenCreate}
        queryKey={QUERY_KEY.class_kit}
        endpoint={ENDPOINT.class_kit}
        onRefetch={onRefetch}
        fields={class_kit_fields}
      />
      <Edit
        label="Class Kit"
        open={openEdit}
        heading="Class Kit"
        setOpen={setOpenEdit}
        queryKey={QUERY_KEY.class_kit}
        endpoint={ENDPOINT.class_kit}
        item={item}
        onRefetch={onRefetch}
        fields={class_kit_fields}
      />
    </Container>
  );
};

const Create = ({
  open,
  label,
  setOpen,
  heading,
  endpoint,
  queryKey,
  fields,
  onRefetch = () => {},
}: CreateProps & { fields: Record<string, any>[] }) => {
  const formMethods = useForm();
  const create = usePostData(
    queryKey,
    endpoint,
    `${label} created successfully!`
  );

  const onSubmit = formMethods.handleSubmit((values) => {
    create.mutate({ ...values });
    setOpen(false);
    formMethods.reset();
  });

  useEffect(() => {
    onRefetch();
  }, [open]);

  return (
    <FormProvider {...formMethods}>
      <FormModal
        submitTxt="Save"
        heading={`Create ${heading}`}
        open={open}
        setOpen={() => setOpen(!open)}
        onSave={onSubmit}
      >
        {fields.map((field, index) => (
          <div key={index}>
            <RenderForm key={index} field={field} />
          </div>
        ))}
      </FormModal>
    </FormProvider>
  );
};

type EditProps = {
  item: IdKey & ClassKitInput;
  fields: Record<string, any>[];
} & CreateProps;

const Edit = ({
  open,
  label,
  item,
  setOpen,
  heading,
  endpoint,
  queryKey,
  fields,
}: EditProps) => {
  const formMethods = useForm({
    defaultValues: { ...item },
  });

  const update = usePatchData(
    queryKey,
    endpoint,
    `${label} updated successfully!`
  );

  const onSubmit = formMethods.handleSubmit((values: IdKey & ClassKitInput) => {
    update.mutate({ id: values.id, data: { ...values } });
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
        heading={`Edit ${heading}`}
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
        {fields.map((field, index) => (
          <div key={index}>
            <RenderForm key={index} field={field} />
          </div>
        ))}
      </FormModal>
    </FormProvider>
  );
};

export const generateColumns = (enumObj: Record<string, any>) => {
  return Object.entries(enumObj).map(([key, label]) => {
    return defaultColumnHelper.accessor(key, {
      header: label,
      ...(key.includes("created_at") || key.includes("updated_at")
        ? {
            cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy") || "-",
          }
        : {}),
    });
  });
};
