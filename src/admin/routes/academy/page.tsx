import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AcademicCapSolid, Pencil } from "@medusajs/icons";
import {
  Heading,
  Container,
  Button,
  createDataTableColumnHelper,
} from "@medusajs/ui";
import { DataTable, ActionMenu } from "../../components";
import {
  DefaultKeys,
  ENDPOINT,
  NameInput,
  QUERY_KEY,
  WIDGET,
  IdKey,
} from "../../shared";
import { Create } from "./create";
import { Edit } from "./edit";
import { format } from "date-fns";

const columnHelper = createDataTableColumnHelper<
  IdKey & NameInput & DefaultKeys
>();

enum LABEL {
  class = "Class",
  section = "Section",
  language = "Language",
}

const AcademyPage = () => {
  return (
    <>
      <Heading className="p-5">Academy</Heading>
      {/* Class */}
      <Section
        heading={LABEL.class}
        label={LABEL.class}
        queryKey={QUERY_KEY.classes}
        endpoint={ENDPOINT.class}
      />
      {/* Section */}
      <Section
        heading={LABEL.section}
        label={LABEL.section}
        queryKey={QUERY_KEY.sections}
        endpoint={ENDPOINT.section}
      />
      {/* Language */}
      <Section
        heading={LABEL.language}
        label={LABEL.language}
        queryKey={QUERY_KEY.languages}
        endpoint={ENDPOINT.language}
      />
    </>
  );
};

type SectionProps = {
  heading: string;
  label: string;
  queryKey: string;
  endpoint: string;
};

const Section = ({ heading, label, endpoint, queryKey }: SectionProps) => {
  const [openCreate, setOpenCreate] = useState<boolean>(false);
  const [openEdit, setOpenEdit] = useState<boolean>(false);
  const [item, setItem] = useState<IdKey & NameInput>({ id: "", name: "" });

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
    columnHelper.accessor("created_at", {
      header: "Created At",
      cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy") || "-",
    }),
    columnHelper.accessor("updated_at", {
      header: "Updated At",
      cell: ({ getValue }) => format(getValue(), "dd-MM-yyyy") || "-",
    }),
    columnHelper.accessor("id", {
      header: "Actions",
      maxSize: 50,
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
    }),
  ];

  const onUpdate = (row: IdKey & NameInput & DefaultKeys) => {
    setOpenEdit(true);
    setItem(row);
  };

  return (
    <Container className="divide-x p-0 mb-5">
      <div className="flex flex-row items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading className="p-4">{heading}</Heading>
        <Button
          type="button"
          onClick={() => setOpenCreate(true)}
          variant="secondary"
          className="mr-5"
        >
          Create
        </Button>
      </div>

      <DataTable
        limit={5}
        queryKey={queryKey}
        endpoint={endpoint}
        columns={columns}
      />

      <Create
        label={label}
        open={openCreate}
        heading={heading}
        setOpen={setOpenCreate}
        queryKey={queryKey}
        endpoint={endpoint}
      />
      <Edit
        label={label}
        open={openEdit}
        heading={heading}
        setOpen={setOpenEdit}
        queryKey={queryKey}
        endpoint={endpoint}
        item={item}
      />
    </Container>
  );
};

export const config = defineRouteConfig({
  label: WIDGET.ACADEMY,
  icon: AcademicCapSolid,
});

export default AcademyPage;
