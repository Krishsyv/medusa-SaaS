import _ from "lodash";
import { Pencil } from "@medusajs/icons";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  ENDPOINT,
  IdKey,
  KitInput,
  QUERY_KEY,
  CreateProps,
  DefaultKeys,
  DEFAULT_KEYS,
  generateNumOptions,
  statusOptions,
  useMemoOptions,
} from "../../shared";
import {
  Button,
  Container,
  createDataTableColumnHelper,
  Heading,
} from "@medusajs/ui";
import { generateColumns } from "./class_kit";
import { DataTable } from "../data_table";
import { ActionMenu } from "../actions_menu";
import { usePostData, usePatchData, useGetData } from "../../lib/use_api";
import { FormModal } from "../form_modal";
import { Select, TextInput } from "../form";

const columnHelper = createDataTableColumnHelper<
  IdKey & KitInput & DefaultKeys
>();

enum Kit {
  id = "ID",
  product_id = "Product Id",
  qty = "Quantity",
  status = "Status",
}

export const KitSection = () => {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [item, setItem] = useState<IdKey & KitInput>({
    id: "",
    product_id: "",
    qty: 1,
    status: false,
  });

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
  const columns = [...generateColumns(_.merge({}, Kit, DEFAULT_KEYS)), actions];

  const onUpdate = (row: IdKey & KitInput & DefaultKeys) => {
    setItem(_.omit(row, ["created_at", "updated_at"]));
    setOpenEdit(true);
  };

  return (
    <Container className="divide-x p-0 mb-5">
      <div className="flex flex-row items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading className="p-4">Kit</Heading>
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
        queryKey={QUERY_KEY.kit}
        endpoint={ENDPOINT.kit}
        columns={columns}
      />

      <Create
        label="Kit"
        open={openCreate}
        heading="Kit"
        setOpen={setOpenCreate}
        queryKey={QUERY_KEY.kit}
        endpoint={ENDPOINT.kit}
        item={item}
      />
      <Edit
        label="Kit"
        open={openEdit}
        heading="Kit"
        setOpen={setOpenEdit}
        queryKey={QUERY_KEY.kit}
        endpoint={ENDPOINT.kit}
        item={item}
      />
    </Container>
  );
};

type CreateEditProps = {
  item: IdKey & KitInput;
} & CreateProps;

const Create = ({
  open,
  label,
  setOpen,
  heading,
  endpoint,
  queryKey,
}: CreateEditProps) => {
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

  const { data, refetch }: any = useGetData(
    QUERY_KEY.products,
    ENDPOINT.get_products
  );

  useEffect(() => { refetch() }, [open])

  const productOptions = useMemoOptions({
    data: data?.products,
    custom: { labelProperty: "id", valueProperty: "id" },
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
         <Select
          label="Product"
          name="product_id"
          placeholder="Select Product"
          options={productOptions}
          rules={{
            required: "Product ID is required",
          }}
        />
         <Select
          label="Quantity"
          name="qty"
          placeholder="Select Quantity"
          options={generateNumOptions(10)}
          rules={{
            required: "Quantity is required",
          }}
        />
         <Select
          label="Status"
          name="status"
          placeholder="Select Status"
          options={statusOptions}
          rules={{
            required: "Status name is required",
          }}
        />
      </FormModal>
    </FormProvider>
  );
};

const Edit = ({
  open,
  label,
  item,
  setOpen,
  heading,
  endpoint,
  queryKey,
}: CreateEditProps) => {
  const formMethods = useForm({
    defaultValues: { ...item },
  });

  const update = usePatchData(
    queryKey,
    endpoint,
    `${label} updated successfully!`
  );

  const onSubmit = formMethods.handleSubmit((values: IdKey & KitInput) => {
    update.mutate({ id: values.id, data: { ...values } });
    setOpen(false);
    formMethods.reset();
  });
  const { data, refetch }: any = useGetData(
    QUERY_KEY.products,
    ENDPOINT.get_products
  );

  useEffect(() => { refetch() }, [open])

  useEffect(() => {
    formMethods.reset({ ...item });
  }, [item]);

  const productOptions = useMemoOptions({
    data: data?.products,
    custom: { labelProperty: "id", valueProperty: "id" },
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
          label="ID"
          name="id"
          disabled
          rules={{ required: "ID is required" }}
        />
         <Select
          label="Product"
          name="product_id"
          placeholder="Select Product"
          options={productOptions}
          rules={{
            required: "Product ID is required",
          }}
        />
         <Select
          label="Quantity"
          name="qty"
          placeholder="Select Quantity"
          options={generateNumOptions(10)}
          rules={{
            required: "Quantity is required",
          }}
        />
         <Select
          label="Status"
          name="status"
          placeholder="Select Status"
          options={statusOptions}
          rules={{
            required: "Product ID name is required",
          }}
        />
      </FormModal>
    </FormProvider>
  );
};
