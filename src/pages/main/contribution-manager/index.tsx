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
import type { ContributionDto, ContributionFilterDto, PaginationDto } from "@/dto";
import { useConfirmContribution, usePaginationContribution } from "@/hooks/contribution";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

export const initFilter: ContributionFilterDto = {
  fundId: "",
  memberId: "",
};

export default function ContributionManager() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const cycleIdFromQuery = searchParams.get("cycleId") || "";
  const [filter, setFilter] = useState<ContributionFilterDto>({
    ...initFilter,
    cycleId: cycleIdFromQuery,
  });
  const [pagination, setPagination] = useState<PaginationDto<ContributionFilterDto>>({
    skip: 0,
    take: 10,
    where: { ...initFilter, cycleId: cycleIdFromQuery },
  });
  const [selectedRows, setSelectedRows] = useState<ContributionDto[]>([]);
  const [selectedContribution, setSelectedContribution] = useState<ContributionDto | null>(null);
  const confirmConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationContribution(pagination);
  const { onConfirmContribution, isLoading: isLoadingConfirm } = useConfirmContribution();

  useEffect(() => {
    if (!cycleIdFromQuery) return;
    setFilter((prev) => ({ ...prev, cycleId: cycleIdFromQuery }));
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: { ...prev.where, cycleId: cycleIdFromQuery },
    }));
  }, [cycleIdFromQuery]);

  const handleSearch = (isReset?: boolean) => {
    const newFilter = isReset ? { ...initFilter, cycleId: cycleIdFromQuery } : filter;
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: newFilter,
    }));
    if (isReset) setFilter({ ...initFilter, cycleId: cycleIdFromQuery });
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as ContributionFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleConfirm = async () => {
    if (!selectedContribution) return;
    await onConfirmContribution(selectedContribution.id);
    await refetch();
    setSelectedContribution(null);
  };

  const handleCreate = () => {
    router.push(
      ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.children.ADD_CONTRIBUTION.path,
    );
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

  const columns: TableColumn<ContributionDto>[] = [
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
      body: (rowData: ContributionDto) =>
        new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
          rowData.amount,
        ),
    },
    {
      field: "contributionDate",
      header: "Ngày đóng góp",
      width: 180,
      sortable: true,
    },
    {
      field: "isConfirmed",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: ContributionDto) => (
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

  const rowActions: RowAction<ContributionDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.CONTRIBUTION_MANAGER.children.CONTRIBUTION_LIST.children.DETAIL_CONTRIBUTION.path.replace(
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
        setSelectedContribution(record);
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

      <TableCustom<ContributionDto>
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
        emptyText="Không tìm thấy đóng góp nào"
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
        title="Xác nhận đóng góp"
        message="Bạn có chắc chắn muốn xác nhận khoản đóng góp này không?"
        confirmText="Xác nhận"
        cancelText="Hủy"
        onConfirm={handleConfirm}
      />
    </BaseView>
  );
}
