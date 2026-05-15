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
import type { NotifyTemplateDto, PaginationDto, TemplateFilterDto } from "@/dto";
import { useDeleteTemplate, usePaginationTemplate } from "@/hooks/notification";
import { useRouter } from "@/routers/hooks";
import { PrimeIcons } from "primereact/api";
import { useRef, useState } from "react";

const initFilter: TemplateFilterDto = {
  code: "",
  eventType: "",
};

export default function NotifyTemplateManager() {
  const router = useRouter();
  const [filter, setFilter] = useState<TemplateFilterDto>(initFilter);
  const [pagination, setPagination] = useState<PaginationDto<TemplateFilterDto>>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<NotifyTemplateDto[]>([]);
  const deleteConfirmRef = useRef<ActionConfirmRef>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<NotifyTemplateDto | null>(null);

  const { data, isLoading, refetch, total } = usePaginationTemplate(pagination);
  const { onDeleteTemplate, isLoading: isLoadingDelete } = useDeleteTemplate();

  const handleSearch = (isReset?: boolean) => {
    const newFilter = isReset ? initFilter : filter;
    setPagination((prev) => ({ ...prev, skip: 0, where: newFilter }));
    if (isReset) setFilter(initFilter);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, skip: (page - 1) * pageSize, take: pageSize }));
  };

  const handleDelete = async () => {
    if (!selectedTemplate) return;
    await onDeleteTemplate(selectedTemplate.id);
    await refetch();
    setSelectedTemplate(null);
  };

  const handleCreate = () => {
    router.push(ROUTES.OTHER.NOTIFY_TEMPLATE.children.NOTIFY_TEMPLATE_ADD.path);
  };

  const filterFields: FilterField[] = [
    {
      key: "code",
      label: "Mã mẫu",
      type: "input",
      placeholder: "Nhập mã mẫu",
      col: 12,
    },
    {
      key: "eventType",
      label: "Loại sự kiện",
      type: "input",
      placeholder: "Nhập loại sự kiện",
      col: 12,
    },
  ];

  const columns: TableColumn<NotifyTemplateDto>[] = [
    {
      field: "code",
      header: "Mã mẫu",
      width: 180,
      sortable: true,
    },
    {
      field: "title",
      header: "Tiêu đề",
      width: 250,
    },
    {
      field: "body",
      header: "Nội dung",
      body: (rowData) => (
        <div className="line-clamp-2 text-sm whitespace-normal text-gray-600">
          {rowData.body || "—"}
        </div>
      ),
    },
    {
      field: "channel",
      header: "Kênh",
      width: 100,
      align: "center",
    },
    {
      field: "eventType",
      header: "Sự kiện",
      width: 150,
    },
    {
      field: "isDeleted",
      header: "Trạng thái",
      width: 120,
      align: "center",
      body: (rowData) => (
        <StatusTag
          severity={rowData.isDeleted ? "danger" : "success"}
          value={rowData.isDeleted ? "Đã xóa" : "Hoạt động"}
        />
      ),
    },
  ];

  const rowActions: RowAction<NotifyTemplateDto>[] = [
    {
      key: "edit",
      icon: PrimeIcons.PENCIL,
      tooltip: "Chỉnh sửa",
      severity: "warning",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        router.push(
          ROUTES.OTHER.NOTIFY_TEMPLATE.children.NOTIFY_TEMPLATE_EDIT.path.replace(":id", record.id),
        );
      },
    },
    {
      key: "delete",
      icon: PrimeIcons.TRASH,
      tooltip: "Xóa",
      severity: "danger",
      visible: (record) => !record.isDeleted,
      onClick: (record) => {
        setSelectedTemplate(record);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={setFilter}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom<NotifyTemplateDto>
        data={data || []}
        columns={columns}
        loading={isLoading || isLoadingDelete}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        stripedRows={true}
        showGridlines={true}
        scrollable={true}
        emptyText="Không tìm thấy mẫu thông báo nào"
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
              actions={[CommonActions.create(handleCreate)]}
              justify="start"
              gap="medium"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />

      <ActionConfirm
        ref={deleteConfirmRef}
        title="Xác nhận xóa mẫu thông báo"
        message="Bạn có chắc chắn muốn xóa mẫu thông báo này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
      />
    </BaseView>
  );
}
