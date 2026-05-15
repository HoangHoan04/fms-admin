import { ROUTES } from "@/common/constants";
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
  type TableColumn,
} from "@/components/ui";
import type { DisbursementDto, DisbursementFilterDto, PaginationDto } from "@/dto";
import { useConfirmDisbursement, usePaginationDisbursement } from "@/hooks/disbursement";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: DisbursementFilterDto = {
  fundId: "",
  memberId: "",
};

export default function DisbursementManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<DisbursementFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<DisbursementFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<DisbursementDto[]>([]);
  const [selectedDisbursement, setSelectedDisbursement] = useState<DisbursementDto | null>(null);
  const confirmConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationDisbursement(pagination);
  const { onConfirmDisbursement, isLoading: isLoadingConfirm } = useConfirmDisbursement();

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
    setFilter(newFilters as DisbursementFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleConfirm = async () => {
    if (!selectedDisbursement) return;
    await onConfirmDisbursement(selectedDisbursement.id);
    await refetch();
    setSelectedDisbursement(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.DISBURSEMENT_MANAGER.children.ADD_DISBURSEMENT.path);
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
      key: "memberId",
      label: "Mã thành viên",
      type: "input",
      placeholder: "Nhập mã thành viên",
      col: 12,
    },
  ];

  const columns: TableColumn<DisbursementDto>[] = [
    {
      field: "code",
      header: "Mã giải ngân",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "fundName",
      header: "Tên quỹ",
      width: 200,
      sortable: true,
    },
    {
      field: "memberName",
      header: "Thành viên",
      width: 200,
      sortable: true,
    },
    {
      field: "amount",
      header: "Số tiền",
      width: 150,
      sortable: true,
      body: (rowData: DisbursementDto) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          rowData.amount,
        ),
    },
    {
      field: "disbursementDate",
      header: "Ngày giải ngân",
      width: 180,
      sortable: true,
    },
    {
      field: "isConfirmed",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: DisbursementDto) => (
        <StatusTag
          severity={rowData.isConfirmed ? "success" : "warning"}
          value={rowData.isConfirmed ? "Đã xác nhận" : "Chờ xác nhận"}
        />
      ),
    },
    {
      field: "createdAt",
      header: "Ngày tạo",
      width: 180,
      sortable: true,
    },
  ];

  const rowActions: RowAction<DisbursementDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.DISBURSEMENT_MANAGER.children.DETAIL_DISBURSEMENT.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "confirm",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Xác nhận",
      severity: "success",
      visible: (record) => !record.isConfirmed,
      onClick: (record) => {
        setSelectedDisbursement(record);
        confirmConfirmRef.current?.show();
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

      <TableCustom<DisbursementDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingConfirm}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy giải ngân nào"
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
        ref={confirmConfirmRef}
        title="Xác nhận giải ngân"
        message="Bạn có chắc chắn muốn xác nhận khoản giải ngân này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirm}
      />
    </BaseView>
  );
}
