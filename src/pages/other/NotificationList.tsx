import { formatTimeAgo } from "@/common/helpers";
import {
  type FilterField,
  type TableColumn,
  type RowAction,
  BaseView,
  FilterComponent,
  TableCustom,
} from "@/components/ui";
import type {
  NotifyFilterDto,
  NotifyCategory,
  NotifyColorType,
  NotifyPaginationDto,
  NotificationItem,
} from "@/dto";
import { usePaginationNotification, useMarkReadList, useMarkAllRead } from "@/hooks/notification";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { useState } from "react";

const initFilter: NotifyFilterDto = {
  category: undefined,
  colorType: undefined,
  isSeen: undefined,
  isNotifyOffScreen: undefined,
};

const CATEGORY_OPTIONS: { label: string; value: NotifyCategory }[] = [
  { label: "Xác thực", value: "AUTH" },
  { label: "Hệ thống", value: "SYSTEM" },
  { label: "Thanh toán", value: "PAYMENT" },
  { label: "Khuyến mãi", value: "PROMOTION" },
  { label: "Chung", value: "GENERAL" },
];

const COLOR_TYPE_OPTIONS: { label: string; value: NotifyColorType }[] = [
  { label: "Xanh dương", value: "BLUE" },
  { label: "Xanh lá", value: "GREEN" },
  { label: "Đỏ", value: "RED" },
  { label: "Vàng", value: "YELLOW" },
  { label: "Cam", value: "ORANGE" },
  { label: "Tím", value: "PURPLE" },
  { label: "Xám", value: "GRAY" },
];

const getIconByCategory = (category: NotifyCategory): string => {
  switch (category) {
    case "AUTH":
      return "pi pi-user";
    case "PAYMENT":
      return "pi pi-credit-card";
    case "BOOKING":
      return "pi pi-calendar";
    case "PROMOTION":
      return "pi pi-tag";
    case "SYSTEM":
      return "pi pi-cog";
    case "GENERAL":
    default:
      return "pi pi-info-circle";
  }
};

const getSeverityByCategory = (category: NotifyCategory) => {
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
    case "GENERAL":
    default:
      return "info";
  }
};

const getCategoryLabel = (category: NotifyCategory): string =>
  CATEGORY_OPTIONS.find((o) => o.value === category)?.label ?? category;

const getSeverityByColorType = (colorType: NotifyColorType) => {
  switch (colorType) {
    case "GREEN":
      return "success";
    case "RED":
      return "danger";
    case "YELLOW":
    case "ORANGE":
      return "warning";
    case "GRAY":
      return "secondary";
    case "BLUE":
    case "PURPLE":
    default:
      return "info";
  }
};

const NotificationListPage = () => {
  const [filter, setFilter] = useState<NotifyFilterDto>(initFilter);
  const [pagination, setPagination] = useState<NotifyPaginationDto>({
    skip: 0,
    take: 10,
    where: initFilter,
  });

  const { data: notifications, total, isLoading, refetch } = usePaginationNotification(pagination);

  const { onMarkReadList } = useMarkReadList();
  const { onMarkAllRead } = useMarkAllRead();

  const filterFields: FilterField[] = [
    {
      key: "category",
      label: "Danh mục",
      type: "select",
      placeholder: "Chọn danh mục",
      col: 8,
      options: CATEGORY_OPTIONS,
    },
    {
      key: "colorType",
      label: "Loại màu",
      type: "select",
      placeholder: "Chọn loại màu",
      col: 8,
      options: COLOR_TYPE_OPTIONS,
    },
    {
      key: "isSeen",
      label: "Trạng thái",
      type: "select",
      placeholder: "Chọn trạng thái",
      col: 8,
      options: [
        { label: "Đã xem", value: true },
        { label: "Chưa xem", value: false },
      ],
    },
  ];

  const columns: TableColumn<NotificationItem>[] = [
    {
      field: "category",
      header: "Danh mục",
      width: "140px",
      body: (rowData) => (
        <Tag
          icon={getIconByCategory(rowData.category)}
          value={getCategoryLabel(rowData.category)}
          severity={getSeverityByCategory(rowData.category) as any}
        />
      ),
    },
    {
      field: "title",
      header: "Tiêu đề",
      body: (rowData) => (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${!rowData.isSeen ? "text-blue-700" : ""}`}>
            {rowData.title}
          </span>
          {!rowData.isSeen && <div className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />}
        </div>
      ),
    },
    {
      field: "description",
      header: "Mô tả",
      body: (rowData) => (
        <div className="line-clamp-2 text-sm wrap-break-word whitespace-normal text-gray-600">
          {rowData.description ?? "—"}
        </div>
      ),
    },
    {
      field: "colorType",
      header: "Màu",
      width: "120px",
      align: "center",
      body: (rowData) => (
        <Tag
          value={rowData.colorType}
          severity={getSeverityByColorType(rowData.colorType) as any}
        />
      ),
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
      field: "isSeen",
      header: "Đã xem",
      width: "80px",
      type: "boolean",
      align: "center",
    },
  ];

  const rowActions: RowAction<NotificationItem>[] = [
    {
      key: "markRead",
      icon: "pi pi-check",
      tooltip: "Đánh dấu đã xem",
      severity: "success",
      onClick: (record) => {
        if (!record.isSeen) onMarkReadList([record.id]);
      },
      disabled: (record) => record.isSeen,
    },
  ];

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({
      ...prev,
      skip: (page - 1) * pageSize,
      take: pageSize,
    }));
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
            <Button
              label="Đánh dấu tất cả đã xem"
              icon="pi pi-check-square"
              severity="info"
              onClick={() => onMarkAllRead()}
              outlined
              size="small"
              className="text-sm!"
            />
          ),
          showRefreshButton: true,
          onRefresh: refetch,
        }}
      />
    </BaseView>
  );
};

export default NotificationListPage;
