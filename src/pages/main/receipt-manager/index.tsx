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
import type { PaginationDto, ReceiptDto, ReceiptFilterDto } from "@/dto";
import { useApproveReceipt, usePaginationReceipt, useRejectReceipt } from "@/hooks/receipt";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: ReceiptFilterDto = {
  fundId: "",
  status: "",
};

export default function ReceiptManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<ReceiptFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<ReceiptFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<ReceiptDto[]>([]);
  const [selectedReceipt, setSelectedReceipt] = useState<ReceiptDto | null>(null);
  const approveConfirmRef = useRef<ActionConfirmRef>(null);
  const rejectConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationReceipt(pagination);
  const { onApproveReceipt, isLoading: isLoadingApprove } = useApproveReceipt();
  const { onRejectReceipt, isLoading: isLoadingReject } = useRejectReceipt();

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
    setFilter(newFilters as ReceiptFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleApprove = async () => {
    if (!selectedReceipt) return;
    await onApproveReceipt(selectedReceipt.id);
    await refetch();
    setSelectedReceipt(null);
  };

  const handleReject = async () => {
    if (!selectedReceipt) return;
    await onRejectReceipt(selectedReceipt.id);
    await refetch();
    setSelectedReceipt(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.RECEIPT_MANAGER.children.ADD_RECEIPT.path);
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
      key: "status",
      label: "Trạng thái",
      type: "input",
      placeholder: "Nhập trạng thái",
      col: 12,
    },
  ];

  const columns: TableColumn<ReceiptDto>[] = [
    {
      field: "code",
      header: "Mã biên lai",
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
      body: (rowData: ReceiptDto) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          rowData.amount,
        ),
    },
    {
      field: "receiptDate",
      header: "Ngày biên lai",
      width: 180,
      sortable: true,
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: ReceiptDto) => (
        <StatusTag
          severity={
            rowData.status === "APPROVED"
              ? "success"
              : rowData.status === "REJECTED"
                ? "danger"
                : "warning"
          }
          value={rowData.status}
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

  const rowActions: RowAction<ReceiptDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.RECEIPT_MANAGER.children.DETAIL_RECEIPT.path.replace(":id", record.id),
        ),
    },
    {
      key: "approve",
      icon: PrimeIcons.CHECK_CIRCLE,
      tooltip: "Duyệt",
      severity: "success",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => {
        setSelectedReceipt(record);
        approveConfirmRef.current?.show();
      },
    },
    {
      key: "reject",
      icon: PrimeIcons.BAN,
      tooltip: "Từ chối",
      severity: "danger",
      visible: (record) => record.status === "PENDING",
      onClick: (record) => {
        setSelectedReceipt(record);
        rejectConfirmRef.current?.show();
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

      <TableCustom<ReceiptDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingApprove || isLoadingReject}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy biên lai nào"
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
        ref={approveConfirmRef}
        title="Xác nhận duyệt biên lai"
        message="Bạn có chắc chắn muốn duyệt biên lai này không?"
        confirmText="Duyệt"
        cancelText="Hủy"
        onConfirm={handleApprove}
      />

      <ActionConfirm
        ref={rejectConfirmRef}
        title="Xác nhận từ chối biên lai"
        message="Bạn có chắc chắn muốn từ chối biên lai này không?"
        confirmText="Từ chối"
        cancelText="Hủy"
        onConfirm={handleReject}
      />
    </BaseView>
  );
}
