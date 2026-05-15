import type { PageRequest, PageResponse } from "@/dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export interface ActionLogFilter {
  entityName?: string;
  entityId?: string;
  actionType?: string;
  createdBy?: string;
}

export const ActionType: Record<string, string> = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  CANCEL: "Hủy",
  APPROVE: "Phê duyệt",
  DEACTIVE: "Ngừng hoạt động",
  ACTIVE: "Kích hoạt",
};

export interface ActionLogDto {
  id: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string | null;
  isDeleted: boolean;
  createdById: string;
  createdByCode: string;
  createdByName: string;
  createdNote: string;
  actionType: string;
  entityName: string;
  entityId: string;
  oldValue: string | null;
  newValue: string | null;
  ipAddress: string | null;
  userAgent: string | null;
}

export const useActionsLogPagination = (params: PageRequest<ActionLogFilter>) => {
  const { data, isLoading, refetch, error } = useQuery({
    queryKey: [API_ENDPOINTS.ACTION_LOG, params],
    queryFn: async () => {
      const response = await rootApiService.post<PageResponse<ActionLogDto>>(
        API_ENDPOINTS.ACTION_LOG,
        params,
      );
      return response;
    },
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
    error,
  };
};
