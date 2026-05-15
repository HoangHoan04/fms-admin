import {
  BaseView,
  FilterComponent,
  StatusTag,
  TableCustom,
  type FilterField,
  type TableColumn,
} from "@/components/ui";
import type { PaginationDto } from "@/dto";
import type { TransactionDto, TransactionFilterDto } from "@/dto/transaction.dto";
import { usePaginationTransaction } from "@/hooks/transaction";
import { useState } from "react";

export const initFilter: TransactionFilterDto = {
  fundId: "",
  type: "",
};

export default function TransactionManager() {
  const [filter, setFilter] = useState<TransactionFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<TransactionFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, isLoading, refetch, total } = usePaginationTransaction(pagination);

  const handleSearch = (isReset?: boolean) => {
    const newFilter = isReset ? initFilter : filter;
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: newFilter,
    }));
    if (isReset) setFilter(initFilter);
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as TransactionFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const filterFields: FilterField[] = [
    {
      key: "fundId",
      label: "Mã quỹ",
      type: "input",
      placeholder: "Nhập mã quỹ",
      col: 12,
    },
    {
      key: "type",
      label: "Loại giao dịch",
      type: "select",
      placeholder: "Chọn loại giao dịch",
      options: [
        { label: "Thu", value: "INCOME" },
        { label: "Chi", value: "EXPENSE" },
      ],
      col: 12,
    },
  ];

  const columns: TableColumn<TransactionDto>[] = [
    {
      field: "fundName",
      header: "Tên quỹ",
      width: 200,
      sortable: true,
    },
    {
      field: "type",
      header: "Loại",
      width: 150,
      align: "center",
      body: (rowData: TransactionDto) => (
        <StatusTag
          severity={rowData.type === "INCOME" ? "success" : "danger"}
          value={rowData.type === "INCOME" ? "Thu" : "Chi"}
        />
      ),
    },
    {
      field: "amount",
      header: "Số tiền",
      width: 150,
      sortable: true,
      body: (rowData: TransactionDto) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          rowData.amount,
        ),
    },
    {
      field: "transactionDate",
      header: "Ngày giao dịch",
      width: 180,
      sortable: true,
    },
    {
      field: "description",
      header: "Mô tả",
      width: 300,
    },
  ];

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<TransactionDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy giao dịch nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "right",
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />
    </BaseView>
  );
}
