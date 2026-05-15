import { ROUTES } from "@/common/constants";
import { enumData } from "@/common/enums";
import {
  type ActionConfirmRef,
  type FilterField,
  type TableColumn,
  StatusTag,
  type RowAction,
  BaseView,
  FilterComponent,
  TableCustom,
  RowActions,
  CommonActions,
  ActionConfirm,
} from "@/components/ui";
import type { PermissionFilterDto, PaginationDto, PermissionDto } from "@/dto";
import {
  usePaginationPermission,
  useDeactivatePermission,
  useActivatePermission,
  useSyncPermissions,
} from "@/hooks/permission";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { Button } from "primereact/button";
import { useState, useRef } from "react";

export const initFilter: PermissionFilterDto = {
  code: "",
  name: "",
  module: "",
};

export default function PermissionManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<PermissionFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<PermissionFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<PermissionDto[]>([]);
  const [selectedPermission, setSelectedPermission] = useState<PermissionDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationPermission(pagination);
  const { onDeactivatePermission, isLoading: isLoadingDeactivate } = useDeactivatePermission();
  const { onActivatePermission, isLoading: isLoadingActivate } = useActivatePermission();
  const { onSyncPermissions, isLoading: syncing } = useSyncPermissions();

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
    setFilter(newFilters as PermissionFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedPermission) return;
    await onActivatePermission(selectedPermission.id);
    await refetch();
    setSelectedPermission(null);
  };

  const handleDeactivate = async () => {
    if (!selectedPermission) return;
    await onDeactivatePermission(selectedPermission.id);
    await refetch();
    setSelectedPermission(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.ADD_PERMISSION.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã quyền",
      type: "input",
      placeholder: "Nhập mã quyền",
      col: 8,
    },
    {
      key: "name",
      label: "Tên quyền",
      type: "input",
      placeholder: "Nhập tên quyền",
      col: 8,
    },
    {
      key: "module",
      label: "Module",
      type: "input",
      placeholder: "Nhập tên module",
      col: 8,
    },
  ];

  const columns: TableColumn<PermissionDto>[] = [
    {
      field: "code",
      header: "Mã quyền",
      width: 200,
      sortable: true,
      frozen: true,
    },
    {
      field: "name",
      header: "Tên quyền",
      width: 200,
      sortable: true,
    },
    {
      field: "module",
      header: "Module",
      width: 150,
      sortable: true,
    },
    {
      field: "action",
      header: "Hành động",
      width: 120,
    },
    {
      field: "isDeleted",
      header: "Trạng thái",
      width: 150,
      align: "center",
      body: (rowData: PermissionDto) => (
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

  const rowActions: RowAction<PermissionDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.DETAIL_PERMISSION.path.replace(
            ":id",
            record.id,
          ),
        ),
    },
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "success",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.MAIN.ROLE_MANAGER.children.PERMISSION_MANAGER.children.EDIT_PERMISSION.path.replace(
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
        setSelectedPermission(record);
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
        setSelectedPermission(record);
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

      <TableCustom<PermissionDto>
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
        emptyText="Không tìm thấy quyền nào"
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
              <Button
                label="Đồng bộ quyền"
                icon="pi pi-sync"
                style={{ height: 30, fontSize: 13 }}
                loading={syncing}
                onClick={() => onSyncPermissions()}
                outlined
                severity="info"
              />
            </>
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={activateConfirmRef}
        title="Xác nhận kích hoạt quyền"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động quyền"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
