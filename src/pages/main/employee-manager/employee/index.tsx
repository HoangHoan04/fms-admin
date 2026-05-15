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
import type { EmployeeFilterDto, PaginationDto, EmployeeDto } from "@/dto";
import { usePaginationEmployee, useDeactivateEmployee, useActivateEmployee } from "@/hooks/employee";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

export const initFilter: EmployeeFilterDto = {
  fullName: "",
  email: "",
  phone: "",
};

export default function EmployeeManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<EmployeeFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<EmployeeFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<EmployeeDto[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDto | null>(null);
  const activateConfirmRef = useRef<ActionConfirmRef>(null);
  const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

  const { data, isLoading, refetch, total } = usePaginationEmployee(pagination);
  const { onDeactivateEmployee, isLoading: isLoadingDeactivate } = useDeactivateEmployee();
  const { onActivateEmployee, isLoading: isLoadingActivate } = useActivateEmployee();

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
    setFilter(newFilters as EmployeeFilterDto);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
  };

  const handleActivate = async () => {
    if (!selectedEmployee) return;
    await onActivateEmployee(selectedEmployee.id);
    await refetch();
    setSelectedEmployee(null);
  };

  const handleDeactivate = async () => {
    if (!selectedEmployee) return;
    await onDeactivateEmployee(selectedEmployee.id);
    await refetch();
    setSelectedEmployee(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.ADD_EMPLOYEE.path);
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

  const columns: TableColumn<EmployeeDto>[] = [
    {
      field: "code",
      header: "Mã nhân viên",
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
      body: (rowData: EmployeeDto) => (
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

  const rowActions: RowAction<EmployeeDto>[] = [
    {
      key: "view",
      icon: PrimeIcons.EYE,
      tooltip: "Xem chi tiết",
      severity: "info",
      onClick: (record) =>
        router.push(
          ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.DETAIL_EMPLOYEE.path.replace(
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
          ROUTES.MAIN.MEMBER_MANAGER.children.EMPLOYEE_LIST.children.EDIT_EMPLOYEE.path.replace(
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
        setSelectedEmployee(record);
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
        setSelectedEmployee(record);
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

      <TableCustom<EmployeeDto>
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
        emptyText="Không tìm thấy nhân viên nào"
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
        title="Xác nhận kích hoạt nhân viên"
        confirmText="Kích hoạt"
        cancelText="Hủy"
        onConfirm={handleActivate}
      />

      <ActionConfirm
        ref={deactivateConfirmRef}
        title="Xác nhận ngừng hoạt động nhân viên"
        confirmText="Ngừng hoạt động"
        cancelText="Hủy"
        onConfirm={handleDeactivate}
      />
    </BaseView>
  );
}
