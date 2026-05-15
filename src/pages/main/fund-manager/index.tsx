import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import { formatCurrency } from "@/common/helpers";
import {
  ActionConfirm,
  BaseView,
  CommonActions,
  FilterComponent,
  RowActions,
  StatusTag,
  TableCustom,
  type ActionConfirmRef,
  type FilterField,
  type RowAction,
  type SeverityType,
  type TableColumn,
} from "@/components/ui";
import type { FundDto, FundFilterDto, PaginationDto } from "@/dto";
import { useActivateFund, useDeactivateFund, usePaginationFund } from "@/hooks/fund";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: FundFilterDto = {
  code: "",
  name: "",
  status: "",
  isDeleted: undefined,
};

export default function FundManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<FundFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<FundFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<FundDto[]>([]);
  const [selectedFund, setSelectedFund] = useState<FundDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationFund(pagination);
  const { onActivateFund, isLoading: isLoadingActivate } = useActivateFund();
  const { onDeactivateFund, isLoading: isLoadingDeactivate } = useDeactivateFund();

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
    setFilter(newFilters as FundFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedFund) return;
    await onActivateFund(selectedFund.id);
    await refetch();
    setSelectedFund(null);
  };

  const handleDeactivate = async () => {
    if (!selectedFund) return;
    await onDeactivateFund(selectedFund.id);
    await refetch();
    setSelectedFund(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.FUND_MANAGER.children.ADD_FUND.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã quỹ",
      type: "input",
      placeholder: "Nhập mã quỹ",
      col: 8,
    },
    {
      key: "name",
      label: "Tên quỹ",
      type: "input",
      placeholder: "Nhập tên quỹ",
      col: 8,
    },
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      options: Object.values(enumData.FUND_STATUS).map((status) => ({
        id: status.id,
        name: status.name,
        value: status.value,
      })),
      col: 8,
    },
  ];

  const columns: TableColumn<FundDto>[] = [
    {
      field: "code",
      header: "Mã quỹ",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên quỹ",
      width: 200,
      sortable: true,
    },
    {
      field: "contributionAmount",
      header: "Số tiền đóng/kỳ",
      width: 160,
      align: "right",
      body: (rowData: FundDto) => formatCurrency(rowData.contributionAmount),
    },
    {
      field: "cycleType",
      header: "Loại chu kỳ",
      width: 130,
      align: "center",
      body: (rowData: FundDto) => {
        const cycleType = Object.values(enumData.CYCLE_TYPE).find(
          (ct) => ct.id === rowData.cycleType,
        );
        return cycleType ? cycleType.name : rowData.cycleType;
      },
    },
    {
      field: "maxRecipientPerCycle",
      header: "SL nhận/kỳ",
      width: 110,
      align: "center",
    },
    {
      field: "totalMembers",
      header: "Số thành viên",
      width: 120,
      align: "center",
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 140,
      align: "center",
      body: (rowData: FundDto) => (
        <StatusTag
          severity={
            (Object.values(enumData.FUND_STATUS).find((s) => s.id === rowData.status)?.severity ||
              "info") as SeverityType
          }
          value={
            Object.values(enumData.FUND_STATUS).find((s) => s.name === rowData.status)?.code ||
            rowData.status
          }
        />
      ),
    },
    {
      field: "isDeleted",
      header: "Xóa mềm",
      width: 120,
      align: "center",
      body: (rowData: FundDto) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={
            rowData.isDeleted
              ? enumData.STATUS_FILTER.INACTIVE.name
              : enumData.STATUS_FILTER.ACTIVE.name
          }
        />
      ),
    },
  ];

  const rowActions: RowAction<FundDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(ROUTES.MAIN.FUND_MANAGER.children.DETAIL_FUND.path.replace(":id", record.id)),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(ROUTES.MAIN.FUND_MANAGER.children.EDIT_FUND.path.replace(":id", record.id));
      },
    },
    {
      key: "cycles",
      icon: PrimeIcons.CALENDAR,
      tooltip: "Xem chu kỳ",
      severity: "info",
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.path.replace(":fundId", record.id),
        );
      },
    },
    {
      key: "deactivate",
      icon: PrimeIcons.BAN,
      tooltip: "Ngưng hoạt động",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedFund(record);
        deactivateConfirmRef.current?.show();
      },
    },
    {
      key: "activate",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Kích hoạt",
      severity: "success",
      visible: (record) => record.isDeleted,
      onClick: (record) => {
        setSelectedFund(record);
        activateConfirmRef.current?.show();
      },
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

      <TableCustom<FundDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingActivate || isLoadingDeactivate}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy quỹ nào"
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total || 0,
          showTotal: true,
        }}
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <>
              <RowActions
                actions={[CommonActions.create(handleCreate)]}
                justify="start"
                gap="medium"
              />
            </>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt quỹ"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động quỹ"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
