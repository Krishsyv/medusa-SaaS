import { defineRouteConfig } from "@medusajs/admin-sdk";
import { AcademicCapSolid } from "@medusajs/icons";
import {
  Container,
  Heading,
  createDataTableColumnHelper,
  DataTable,
  DataTablePaginationState,
  useDataTable,
  Input,
  toast,
  Button,
} from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sdk } from "../../lib/sdk";
import { useState, useCallback } from "react";
import { IdNameResponse, IdNameDTO } from "../../constants";

const columnHelper = createDataTableColumnHelper<IdNameDTO>();

const columns = [
  columnHelper.accessor("id", { header: "ID" }),
  columnHelper.accessor("name", { header: "Name" }),
];

const AcademyPage = () => {
  const queryClient = useQueryClient();

  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 5,
    pageIndex: 0,
  });

  const [className, setClassName] = useState("");

  const { data, isLoading } = useQuery<IdNameResponse>({
    queryFn: () =>
      sdk.client.fetch(`/admin/api/class`, {
        query: {
          skip: pagination.pageIndex * pagination.pageSize,
          limit: pagination.pageSize,
        },
      }),
    queryKey: ["class", pagination.pageIndex, pagination.pageSize],
  });

  const createClass = useMutation({
    mutationFn: async () => {
      return sdk.client.fetch(`/admin/api/class`, {
        method: "POST",
        body: { name: className, portal_id: "portal_1" },
        headers: { "Content-Type": "application/json" },
      });
    },
    onSuccess: () => {
      toast.success("Class created successfully");
      setClassName("");
      queryClient.invalidateQueries({ queryKey: ["class"] });
    },
    onError: (error) => {
      console.error("Error creating class:", error);
      toast.error(error?.message || "Error creating class");
    },
  });

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      createClass.mutate();
    },
    [createClass]
  );

  const table = useDataTable({
    columns,
    data: data?.list || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: { state: pagination, onPaginationChange: setPagination },
  });

  return (
    <Container className="divide-y p-0">
      <Heading className="p-5">Academy</Heading>
      <DataTable instance={table}>
        {/* <DataTable.Toolbar className="flex flex-col items-start md:flex-row md:items-center"></DataTable.Toolbar> */}
        <form
          onSubmit={handleSubmit}
          className="flex items-center justify-between p-3"
        >
          <Heading className="pl-2">Class</Heading>
          <div className="flex items-center gap-4 pr-5">
            <Input
              name="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              required
              className="w-64"
            />
            <Button type="submit" isLoading={createClass.isPending}>
              Add
            </Button>
          </div>
        </form>
        <DataTable.Table />
        <DataTable.Pagination />
      </DataTable>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Academy",
  icon: AcademicCapSolid,
});

export default AcademyPage;
