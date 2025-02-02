import {
  DataTablePaginationState,
  useDataTable,
  DataTable as MedusaDataTable,
} from "@medusajs/ui";
import { useMemo, useState } from "react";
import { useGetData } from "../lib/use_api";

type DataTableProps = {
  limit: number;
  queryKey: string;
  endpoint: string;
  enableSearch?: boolean;
  enableSorting?: boolean;
  columns: any;
};

export const DataTable = ({
  limit = 5,
  columns,
  queryKey,
  endpoint,
}: DataTableProps) => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });

  const offset = useMemo(() => {
    return pagination.pageIndex * pagination.pageIndex;
  }, [pagination]);

  const { data, isLoading } = useGetData<{ list: any[]; count: number }>(
    queryKey,
    endpoint,
    {
      skip: offset,
      limit: pagination.pageSize,
    }
  );

  const table = useDataTable({
    columns: columns,
    data: data?.list || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
    isLoading,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
  });

  return (
    <MedusaDataTable instance={table}>
      <MedusaDataTable.Table />
      <MedusaDataTable.Pagination />
    </MedusaDataTable>
  );
};
