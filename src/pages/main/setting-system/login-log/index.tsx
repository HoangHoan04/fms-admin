import {
  BaseView,
  FilterComponent,
  StatusTag,
  TableCustom,
  type FilterField,
  type TableColumn,
} from "@/components/ui";
import type { PaginationDto } from "@/dto";
import type { LoginLogDto, LoginLogFilterDto } from "@/dto/login-log.dto";
import { usePaginationLoginLog } from "@/hooks/login-log";
import { useState } from "react";

export const initFilter: LoginLogFilterDto = {
  userId: "",
  status: "",
};

export default function LoginLogManager() {
  const [filter, setFilter] = useState<LoginLogFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<LoginLogFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data, isLoading, refetch, total } = usePaginationLoginLog(pagination);

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
    setFilter(newFilters as LoginLogFilterDto);
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
      key: "userId",
      label: "Mã người dùng",
      type: "input",
      placeholder: "Nhập mã người dùng",
      col: 12,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: [
        { label: "Thành công", value: "success" },
        { label: "Thất bại", value: "failed" },
      ],
      col: 12,
    },
  ];

  const columns: TableColumn<LoginLogDto>[] = [
    {
      field: "username",
      header: "Tên đăng nhập",
      width: 150,
      sortable: true,
    },
    {
      field: "loginProvider",
      header: "Phương thức",
      width: 150,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: LoginLogDto) => (
        <StatusTag
          severity={rowData.status === "success" ? "success" : "danger"}
          value={rowData.status === "success" ? "Thành công" : "Thất bại"}
        />
      ),
    },
    {
      field: "ipAddress",
      header: "Địa chỉ IP",
      width: 150,
    },
    {
      field: "loggedInAt",
      header: "Thời gian",
      width: 180,
      sortable: true,
    },
    {
      field: "failReason",
      header: "Lý do thất bại",
      width: 200,
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

      <TableCustom<LoginLogDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy lịch sử đăng nhập"
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
