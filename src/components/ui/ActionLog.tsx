import { enumData } from "@/common/enums/enum";
import { formatDateTime } from "@/common/helpers/formatHelper";
import { useTheme } from "@/context/ThemeContext";
import { type ActionLogDto, ActionType, useActionsLogPagination } from "@/hooks/action-log";
import { Dialog } from "primereact/dialog";
import { memo, useMemo, useState } from "react";
import { type PaginationConfig, type RowAction, StatusTag, type TableColumn, TableCustom } from ".";

interface ActionLogProps {
  entityName: string;
  entityId?: string;
}

function ActionLog({ entityName, entityId }: ActionLogProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [paginationState, setPaginationState] = useState({
    pageIndex: enumData.PAGE.PAGEINDEX,
    pageSize: enumData.PAGE.PAGESIZE,
  });

  const [selectedLog, setSelectedLog] = useState<ActionLogDto | null>(null);

  const queryPayload = useMemo(() => {
    const skip = (paginationState.pageIndex - 1) * paginationState.pageSize;
    const take = paginationState.pageSize;
    return {
      pageIndex: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      skip: skip,
      take: take,
      where: {
        entityName: entityName,
        entityId: entityId || "",
      },
    };
  }, [paginationState.pageIndex, paginationState.pageSize, entityName, entityId]);

  const { data, total, isLoading } = useActionsLogPagination(queryPayload);

  const columns = useMemo<TableColumn<ActionLogDto>[]>(
    () => [
      {
        field: "createdAt",
        header: "Ngày tạo",
        body: (rowData: ActionLogDto) => formatDateTime(rowData.createdAt, "DD/MM/YYYY HH:mm:ss"),
        style: { width: "160px" },
      },
      {
        field: "createdByName",
        header: "Người tạo",
        style: { width: "180px" },
      },
      {
        field: "createdByCode",
        header: "Mã nhân viên",
        style: { width: "150px" },
      },
      {
        field: "actionType",
        header: "Hành động",
        style: { width: "140px" },
        body: (rowData: ActionLogDto) => {
          const label = ActionType[rowData.actionType] || rowData.actionType;

          let severity: "success" | "warning" | "danger" | "info" = "info";
          const typeStr = String(rowData.actionType).toUpperCase();
          if (typeStr.includes("CREATE") || typeStr.includes("ACTIVE")) severity = "success";
          else if (typeStr.includes("UPDATE")) severity = "warning";
          else if (typeStr.includes("DELETE") || typeStr.includes("DEACTIVE")) severity = "danger";

          return <StatusTag severity={severity} value={label} />;
        },
      },
      {
        field: "createdNote",
        header: "Mô tả",
        style: { minWidth: "300px" },
      },
    ],
    [],
  );

  const rowActions = useMemo<RowAction<ActionLogDto>[]>(
    () => [
      {
        key: "view",
        icon: "pi pi-eye",
        tooltip: "Xem chi tiết thay đổi",
        severity: "info",
        onClick: (record) => setSelectedLog(record),
      },
    ],
    [],
  );

  const paginationConfig = useMemo<PaginationConfig>(
    () => ({
      total: total || 0,
      current: paginationState.pageIndex,
      pageSize: paginationState.pageSize,
      showSizeChanger: true,
    }),
    [total, paginationState.pageIndex, paginationState.pageSize],
  );

  const handlePageChange = (page: number, pageSize: number) => {
    setPaginationState({
      pageIndex: page,
      pageSize: pageSize,
    });
  };

  const parseJsonValue = (jsonStr: string | null): Record<string, any> | null => {
    if (!jsonStr) return null;
    try {
      return JSON.parse(jsonStr);
    } catch {
      return null;
    }
  };

  const oldData = selectedLog ? parseJsonValue(selectedLog.oldValue) : null;
  const newData = selectedLog ? parseJsonValue(selectedLog.newValue) : null;

  if (!entityId) return null;

  return (
    <div className="mt-2">
      <TableCustom<ActionLogDto>
        data={data || []}
        columns={columns}
        loading={isLoading}
        pagination={paginationConfig}
        onPageChange={handlePageChange}
        stripedRows
        rowActions={rowActions}
      />

      <Dialog
        header="Chi tiết thay đổi dữ liệu"
        visible={!!selectedLog}
        style={{ width: "75vw", maxWidth: "1000px" }}
        onHide={() => setSelectedLog(null)}
      >
        {selectedLog && (
          <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
            <div
              className={`rounded-lg border p-3 ${
                isDark ? "border-red-900/40 bg-red-950/10" : "border-red-500 bg-red-50/30"
              }`}
            >
              <h3
                className={`mb-2 flex items-center gap-1 border-b pb-2 text-sm font-bold ${
                  isDark ? "border-red-900/30 text-red-400" : "border-red-100 text-red-600"
                }`}
              >
                <i className="pi pi-history" /> Dữ liệu cũ
              </h3>
              <pre
                className={`custom-scrollbar m-0 max-h-125 overflow-x-auto font-mono text-xs whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {oldData && Object.keys(oldData).length > 0
                  ? JSON.stringify(oldData, null, 2)
                  : "Không có dữ liệu cũ hoặc record được tạo mới."}
              </pre>
            </div>

            <div
              className={`rounded-lg border p-3 ${
                isDark ? "border-green-900/40 bg-green-950/10" : "border-green-200 bg-green-50/30"
              }`}
            >
              <h3
                className={`mb-2 flex items-center gap-1 border-b pb-2 text-sm font-bold ${
                  isDark ? "border-green-900/30 text-green-400" : "border-green-100 text-green-600"
                }`}
              >
                <i className="pi pi-check-circle" /> Dữ liệu mới
              </h3>
              <pre
                className={`custom-scrollbar m-0 max-h-125 overflow-x-auto font-mono text-xs whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-gray-700"
                }`}
              >
                {newData && Object.keys(newData).length > 0
                  ? JSON.stringify(newData, null, 2)
                  : "Không có dữ liệu mới cập nhật."}
              </pre>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}

export default memo(ActionLog);
