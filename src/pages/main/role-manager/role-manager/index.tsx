import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
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
import type { PaginationDto, RoleDto, RoleFilterDto } from "@/dto";
import { useActivateRole, useDeactivateRole, usePaginationRole } from "@/hooks/role";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: RoleFilterDto = {
  code: "",
  name: "",
};

export default function RoleManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<RoleFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<RoleFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<RoleDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationRole(pagination);
  const { onDeactivateRole, isLoading: isLoadingDeactivate } = useDeactivateRole();
  const { onActivateRole, isLoading: isLoadingActivate } = useActivateRole();

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
    setFilter(newFilters as RoleFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedRole) return;
    await onActivateRole(selectedRole.id);
    await refetch();
    setSelectedRole(null);
  };

  const handleDeactivate = async () => {
    if (!selectedRole) return;
    await onDeactivateRole(selectedRole.id);
    await refetch();
    setSelectedRole(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.ADD_ROLE.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã vai trò",
      type: "input",
      placeholder: "Nhập mã vai trò",
      col: 12,
    },
    {
      key: "name",
      label: "Tên vai trò",
      type: "input",
      placeholder: "Nhập tên vai trò",
      col: 12,
    },
  ];

  const columns: TableColumn<RoleDto>[] = [
    {
      field: "code",
      header: "Mã vai trò",
      width: 150,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên vai trò",
      width: 200,
      sortable: true,
    },
    {
      field: "description",
      header: "Mô tả",
      width: 300,
    },
    {
      field: "isDeleted",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: RoleDto) => (
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

  const rowActions: RowAction<RoleDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.DETAIL_ROLE.path.replace(
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
          ROUTES.MAIN.ROLE_MANAGER.children.ROLE_LIST.children.EDIT_ROLE.path.replace(
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
        setSelectedRole(record);
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
        setSelectedRole(record);
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

      <TableCustom<RoleDto>
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
        emptyText="Không tìm thấy vai trò nào"
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
        title="Xác nhận kích hoạt vai trò"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động vai trò"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
