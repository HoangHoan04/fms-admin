import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import {
  CommonActions,
  type ActionConfirmRef,
  type FilterField,
  ActionConfirm,
  BaseView,
  FilterComponent,
  RowActions,
  StatusTag,
  TableCustom,
  type RowAction,
  type TableColumn,
} from "@/components/ui";
import type { MemberFilterDto, PaginationDto, MemberDto } from "@/dto";
import { usePaginationMember, useDeactivateMember, useActivateMember } from "@/hooks/member";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: MemberFilterDto = {
  fullName: "",
  email: "",
  phone: "",
};

export default function MemberManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<MemberFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<MemberFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<MemberDto[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationMember(pagination);
  const { onDeactivateMember, isLoading: isLoadingDeactivate } = useDeactivateMember();
  const { onActivateMember, isLoading: isLoadingActivate } = useActivateMember();

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
    setFilter(newFilters as MemberFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedMember) return;
    await onActivateMember(selectedMember.id);
    await refetch();
    setSelectedMember(null);
  };

  const handleDeactivate = async () => {
    if (!selectedMember) return;
    await onDeactivateMember(selectedMember.id);
    await refetch();
    setSelectedMember(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.ADD_MEMBER.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "fullName",
      label: "Họ và tên",
      type: "input",
      placeholder: "Nhập họ và tên",
      col: 12,
    },
    {
      key: "email",
      label: "Email",
      type: "input",
      placeholder: "Nhập email",
      col: 12,
    },
    {
      key: "phone",
      label: "Số điện thoại",
      type: "input",
      placeholder: "Nhập số điện thoại",
      col: 12,
    },
  ];

  const columns: TableColumn<MemberDto>[] = [
    {
      field: "code",
      header: "Mã thành viên",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "fullName",
      header: "Họ và tên",
      width: 200,
      sortable: true,
    },
    {
      field: "email",
      header: "Email",
      width: 250,
      sortable: true,
    },
    {
      field: "phone",
      header: "Số điện thoại",
      width: 150,
    },
    {
      field: "gender",
      header: "Giới tính",
      width: 100,
      align: "center",
    },
    {
      field: "isDeleted",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: MemberDto) => (
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

  const rowActions: RowAction<MemberDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.DETAIL_MEMBER.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.MEMBER_MANAGER.children.MEMBER_LIST.children.EDIT_MEMBER.path.replace(
            ":id",
            record.id,
          ),
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
        setSelectedMember(record);
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
        setSelectedMember(record);
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

      <TableCustom<MemberDto>
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
        emptyText="Không tìm thấy thành viên nào"
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
        title="Xác nhận kích hoạt thành viên"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động thành viên"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
