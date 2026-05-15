import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums/enum";
import {
  ActionConfirm,
  BaseView,
  CommonActions,
  FilterComponent,
  GlobalLoading,
  RowActions,
  StatusTag,
  TableCustom,
  Title,
  type ActionConfirmRef,
  type FilterField,
  type RowAction,
  type TableColumn,
} from "@/components/ui";
import type { FundCycleDto, FundCycleFilterDto, PaginationDto } from "@/dto";
import { useFundDetail } from "@/hooks/fund";
import { useCloseFundCycle, usePaginationFundCycle } from "@/hooks/fund-cycle";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Card } from "primereact/card";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

const statusSeverityMap: Record<string, "success" | "info" | "warning" | "danger" | "secondary"> = {
  open: "info",
  collecting: "warning",
  closed: "success",
  paid_out: "success",
  cancelled: "danger",
};

const statusNameMap: Record<string, string> = {
  open: "Mở",
  collecting: "Đang thu",
  closed: "Đã đóng",
  paid_out: "Đã giải ngân",
  cancelled: "Đã hủy",
};

export default function FundCycleList() {
  const router = useRouter();
  const { fundId } = useParams();
  const currentFundId = fundId || "";
  const { data: fund, isLoading: isLoadingFund } = useFundDetail(currentFundId);
  const [filter, setFilter] = useState<FundCycleFilterDto>({ status: "" });
  const [pagination, setPagination] = useState<PaginationDto<FundCycleFilterDto>>({
    skip: 0,
    take: 10,
    where: { fundId: currentFundId, status: "" },
  });
  const [selectedRows, setSelectedRows] = useState<FundCycleDto[]>([]);
  const [selectedCycle, setSelectedCycle] = useState<FundCycleDto | null>(null);
  const closeConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationFundCycle(pagination);
  const { onCloseFundCycle, isLoading: isLoadingClose } = useCloseFundCycle();

  useEffect(() => {
    if (!currentFundId) return;
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: { ...prev.where, fundId: currentFundId },
    }));
  }, [currentFundId]);

  const handleSearch = (isReset?: boolean) => {
    const newFilter = isReset ? { status: "" } : filter;
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: { fundId: currentFundId, ...newFilter },
    }));
    if (isReset) setFilter({ status: "" });
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, skip: (page - 1) * pageSize, take: pageSize }));
  };

  const handleClose = async () => {
    if (!selectedCycle) return;
    await onCloseFundCycle(selectedCycle.id);
    await refetch();
    setSelectedCycle(null);
  };

  const handleCreate = () => {
    if (!currentFundId) return;
    router.push(
      ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.ADD_FUND_CYCLE.path.replace(
        ":fundId",
        currentFundId,
      ),
    );
  };

  const filterFields: FilterField[] = [
    {
      key: "status",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 12,
      options: Object.values(enumData.CYCLE_STATUS).map((s) => ({
        id: s.id,
        name: s.name,
        value: s.value,
      })),
    },
  ];

  const columns: TableColumn<FundCycleDto>[] = [
    { field: "code", header: "Mã chu kỳ", width: 150, sortable: true, frozen: true },
    { field: "name", header: "Tên chu kỳ", width: 200, sortable: true },
    { field: "cycleIndex", header: "Kỳ thứ", width: 80, align: "center" },
    {
      field: "contributionAmount",
      header: "Số tiền/kỳ",
      width: 140,
      align: "right",
      body: (r: FundCycleDto) =>
        (r.contributionAmount ?? 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      field: "totalExpected",
      header: "Dự thu",
      width: 120,
      align: "right",
      body: (r: FundCycleDto) =>
        (r.totalExpected ?? 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      field: "totalCollected",
      header: "Đã thu",
      width: 120,
      align: "right",
      body: (r: FundCycleDto) =>
        (r.totalCollected ?? 0).toLocaleString("vi-VN", { style: "currency", currency: "VND" }),
    },
    {
      field: "status",
      header: "Trạng thái",
      width: 130,
      align: "center",
      body: (r: FundCycleDto) => (
        <StatusTag
          severity={statusSeverityMap[r.status] || "info"}
          value={statusNameMap[r.status] || r.status}
        />
      ),
    },
  ];

  const rowActions: RowAction<FundCycleDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Chi tiết",
      severity: "info",
      onClick: (r) =>
        router.push(
          ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.DETAIL_FUND_CYCLE.path.replace(
            ":id",
            r.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Sửa",
      severity: "warning",
      visible: (r) => r.status === "open" || r.status === "collecting",
      onClick: (r) =>
        router.push(
          ROUTES.MAIN.FUND_MANAGER.children.FUND_CYCLES.children.EDIT_FUND_CYCLE.path.replace(
            ":id",
            r.id,
          ),
        ),
    },
    {
      key: "close",
      icon: PrimeIcons.LOCK,
      tooltip: "Đóng chu kỳ",
      severity: "danger",
      visible: (r) => r.status !== "closed" && r.status !== "cancelled",
      onClick: (r) => {
        setSelectedCycle(r);
        closeConfirmRef.current?.show();
      },
    },
  ];

  if (isLoadingFund) return <GlobalLoading />;

  if (!fund) {
    return (
      <BaseView>
        <Card>
          <p>Không tìm thấy quỹ</p>
        </Card>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Title>
        <p className="my-4 text-sm text-gray-500">
          {fund
            ? `Đang xem chu kỳ của quỹ: ${fund.code} - ${fund.name}`
            : "Quản lý vòng đời thu - đóng - giải ngân của quỹ đang chọn."}
        </p>
      </Title>

      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<FundCycleDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingClose}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows
        showGridlines
        scrollable
        emptyText="Không tìm thấy chu kỳ nào"
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
            <RowActions
              actions={currentFundId ? [CommonActions.create(handleCreate)] : []}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />
      <ActionConfirm
        ref={closeConfirmRef}
        title="Xác nhận đóng chu kỳ"
        message="Bạn có chắc chắn muốn đóng chu kỳ này không?"
        confirmText="Đóng"
        cancelText="Hủy"
        onConfirm={handleClose}
      />
    </BaseView>
  );
}
