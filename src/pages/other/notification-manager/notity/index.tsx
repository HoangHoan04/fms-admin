import { formatTimeAgo } from "@/common/helpers";
import {
  type ActionConfirmRef,
  type FilterField,
  type RowAction,
  type TableColumn,
  ActionConfirm,
  BaseView,
  FilterComponent,
  RowActions,
  TableCustom,
} from "@/components/ui";
import { useAuth } from "@/context/AuthContext";
import type { NotifyFilterDto, NotifyItem, NotifyPaginationDto } from "@/dto";
import {
  useDeleteNotification,
  useMarkAllRead,
  useMarkReadList,
  usePaginationNotification,
} from "@/hooks/notification";
import { Tag } from "primereact/tag";
import { useRef, useState } from "react";

const CATEGORY_OPTIONS = [
  { label: "Xác thực", value: "AUTH" },
  { label: "Hệ thống", value: "SYSTEM" },
  { label: "Thanh toán", value: "PAYMENT" },
  { label: "Khuyến mãi", value: "PROMOTION" },
  { label: "Chung", value: "GENERAL" },
];

const getSeverityByCategory = (category?: string) => {
  switch (category) {
    case "AUTH":
      return "info";
    case "PAYMENT":
      return "success";
    case "BOOKING":
      return "info";
    case "PROMOTION":
      return "warning";
    case "SYSTEM":
      return "secondary";
    default:
      return "info";
  }
};

const getCategoryLabel = (category?: string): string =>
  CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? category ?? "—";

const NotifyListPage = () => {
  const { user } = useAuth();
  const initFilter: NotifyFilterDto = !user?.isAdmin && user?.id ? { userId: user.id } : {};

  const [filter, setFilter] = useState<NotifyFilterDto>(initFilter);
  const [pagination, setPagination] = useState<NotifyPaginationDto>({
    skip: 0,
    take: 10,
    where: initFilter,
  });
  const [selectedRows, setSelectedRows] = useState<NotifyItem[]>([]);
  const deleteConfirmRef = useRef<ActionConfirmRef>(null);
  const [selectedNotify, setSelectedNotify] = useState<NotifyItem | null>(null);

  const { data: notifications, total, isLoading, refetch } = usePaginationNotification(pagination);
  const { onMarkReadList } = useMarkReadList();
  const { onMarkAllRead } = useMarkAllRead();
  const { onDeleteNotification } = useDeleteNotification();

  const markSelectedAsRead = () => {
    const ids = selectedRows.filter((r) => !r.isRead).map((r) => r.id);
    if (ids.length) onMarkReadList(ids);
  };

  const handleDelete = async () => {
    if (!selectedNotify) return;
    await onDeleteNotification(selectedNotify.id);
    await refetch();
    setSelectedNotify(null);
  };

  const filterFields: FilterField[] = [
    {
      key: "isRead",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 8,
      options: [
        { label: "Đã xem", value: true },
        { label: "Chưa xem", value: false },
      ],
    },
    {
      key: "channel",
      label: "Kênh",
      type: "select",
      placeholder: "Chọn kênh",
      col: 8,
      options: [
        { label: "Push", value: "push" },
        { label: "Email", value: "email" },
        { label: "SMS", value: "sms" },
      ],
    },
  ];

  const columns: TableColumn<NotifyItem>[] = [
    {
      field: "payload",
      header: "Danh mục",
      width: "140px",
      body: (rowData) => (
        <Tag
          value={getCategoryLabel(rowData.payload?.category)}
          severity={getSeverityByCategory(rowData.payload?.category) as any}
        />
      ),
    },
    {
      field: "title",
      header: "Tiêu đề",
      body: (rowData) => (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${!rowData.isRead ? "text-blue-700" : ""}`}>
            {rowData.title}
          </span>
          {!rowData.isRead && <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
        </div>
      ),
    },
    {
      field: "body",
      header: "Nội dung",
      body: (rowData) => (
        <div className="line-clamp-2 text-sm whitespace-normal text-gray-600">
          {rowData.body ?? "—"}
        </div>
      ),
    },
    {
      field: "channel",
      header: "Kênh",
      width: "80px",
      align: "center",
    },
    {
      field: "createdAt",
      header: "Thời gian",
      width: "140px",
      body: (rowData) => (
        <span className="text-sm text-gray-500">{formatTimeAgo(rowData.createdAt)}</span>
      ),
    },
    {
      field: "isRead",
      header: "Đã xem",
      width: "80px",
      type: "boolean",
      align: "center",
    },
  ];

  const rowActions: RowAction<NotifyItem>[] = [
    {
      key: "markRead",
      icon: "pi pi-check",
      tooltip: "Đánh dấu đã xem",
      severity: "success",
      onClick: (record) => {
        if (!record.isRead) onMarkReadList([record.id]);
      },
      disabled: (record) => record.isRead,
    },
    {
      key: "delete",
      icon: "pi pi-trash",
      tooltip: "Xóa",
      severity: "danger",
      onClick: (record) => {
        setSelectedNotify(record);
        deleteConfirmRef.current?.show();
      },
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, skip: (page - 1) * pageSize, take: pageSize }));
  };

  const handleFiltersChange = (newFilters: Record<string, any>) => {
    setFilter(newFilters as NotifyFilterDto);
  };

  const handleSearch = (isReset?: boolean) => {
    setPagination((prev) => ({
      ...prev,
      skip: 0,
      where: isReset ? initFilter : { ...prev.where, ...filter },
    }));
    if (isReset) setFilter(initFilter);
  };

  return (
    <BaseView>
      <FilterComponent
        fields={filterFields}
        filters={filter}
        onFiltersChange={handleFiltersChange}
        onSearch={() => handleSearch(false)}
        onClear={() => handleSearch(true)}
      />

      <TableCustom
        data={notifications}
        columns={columns}
        loading={isLoading}
        enableSelection={true}
        selectedRows={selectedRows}
        onSelectionChange={setSelectedRows}
        rowActions={rowActions}
        pagination={{
          current: Math.floor(pagination.skip / pagination.take) + 1,
          pageSize: pagination.take,
          total: total ?? 0,
          showTotal: true,
        }}
        scrollable
        stripedRows
        showGridlines
        emptyText="Không tìm thấy thông báo nào"
        onPageChange={handlePageChange}
        toolbar={{
          show: true,
          align: "between",
          leftContent: (
            <RowActions
              actions={[
                {
                  key: "markAll",
                  icon: "pi pi-check-square",
                  label: "Đánh dấu tất cả đã xem",
                  severity: "info",
                  onClick: () => onMarkAllRead(),
                },
                ...(selectedRows.length > 0
                  ? [
                      {
                        key: "markSelected",
                        icon: "pi pi-check",
                        label: `Đã xem (${selectedRows.filter((r) => !r.isRead).length})`,
                        severity: "success" as const,
                        onClick: markSelectedAsRead,
                      },
                    ]
                  : []),
              ]}
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
        title="Xác nhận xóa thông báo"
        message="Bạn có chắc chắn muốn xóa thông báo này?"
        confirmText="Xóa"
        cancelText="Hủy"
        onConfirm={handleDelete}
      />
    </BaseView>
  );
};

export default NotifyListPage;
