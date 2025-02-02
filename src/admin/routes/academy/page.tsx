import { useState } from "react";
import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AcademicCapSolid } from "@medusajs/icons";
import {
  Heading,
  Container,
  Button,
  createDataTableColumnHelper,
} from "@medusajs/ui";
import { FormProvider, useForm } from "react-hook-form";
import { FormModal, TextInput, DataTable } from "../../components";
import { ENDPOINT, IdNameDTO, QUERY_KEY, WIDGET } from "../../shared";
import { usePostData } from "../../lib/use_api";

const columnHelper = createDataTableColumnHelper<IdNameDTO>();

enum LABEL {
  class = "Class",
  section = "Section",
  language = "Language",
}

enum FIELD {
  class = "class",
  section = "section",
  language = "language",
}

const AcademyPage = () => {
  return (
    <>
      <Heading className="p-5">Academy</Heading>
      {/* Class */}
      <Section 
        heading={LABEL.class} 
        label={LABEL.class} 
        name={FIELD.class}
        queryKey={QUERY_KEY.classes}
        endpoint={ENDPOINT.class}
      />
      {/* Section */}
      <Section
        heading={LABEL.section}
        label={LABEL.section}
        name={FIELD.section}
        queryKey={QUERY_KEY.sections}
        endpoint={ENDPOINT.section}
      />
      {/* Language */}
      <Section
        heading={LABEL.language}
        label={LABEL.language}
        name={FIELD.language}
        queryKey={QUERY_KEY.languages}
        endpoint={ENDPOINT.language}
      />
    </>
  );
};

type SectionProps = {
  heading: string;
  label: string;
  name: string;
  queryKey: string;
  endpoint: string;
};

const Section = ({
  heading,
  label,
  name,
  endpoint,
  queryKey,
}: SectionProps) => {
  const formMethods = useForm({
    defaultValues: {
      [name]: "",
    },
  });
  const [open, setOpen] = useState<boolean>(false);

  const columns = [
    columnHelper.accessor("id", { header: "ID" }),
    columnHelper.accessor("name", { header: "Name" }),
  ];

  const create = usePostData(
    queryKey,
    endpoint,
    `${label} created successfully!`
  );

  const handleSubmit = formMethods.handleSubmit((values) => {
    create.mutate({ name: values[name], portal_id: "portal_1" });
    setOpen(false);
    formMethods.reset();
  });

  return (
    <Container className="divide-x p-0 mb-5">
      <div className="flex flex-row items-start justify-between gap-2 md:flex-row md:items-center">
        <Heading className="p-4">{heading}</Heading>
        <Button
          type="button"
          onClick={() => setOpen(true)}
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

      <FormProvider {...formMethods}>
        <FormModal
          submitTxt="Save"
          heading={`Create ${heading}`}
          open={open}
          setOpen={() => setOpen(!open)}
          onSave={handleSubmit}
        >
          <TextInput
            label={label}
            name={name}
            placeholder={`Enter ${label}`}
            rules={{
              required: `${label} name is required`,
            }}
          />
        </FormModal>
      </FormProvider>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: WIDGET.ACADEMY,
  icon: AcademicCapSolid,
});

export default AcademyPage;
