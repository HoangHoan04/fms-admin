import type { PageRequest, PageResponse } from "@/dto";
import { API_ENDPOINTS } from "@/services";
import rootApiService from "@/services/api.service";
import { useQuery } from "@tanstack/react-query";

export interface ActionLogFilter {
  functionType: string;
  functionId: string;
  type?: string;
  createdBy?: string;
}

export const ActionType = {
  CREATE: "Tạo mới",
  UPDATE: "Cập nhật",
  DELETE: "Xóa",
  CANCEL: "Hủy",
  APPROVE: "Phê duyệt",
  DEACTIVE: "Ngừng hoạt động",
  ACTIVE: "Kích hoạt",
} as const;

export interface ActionLogDto {
  id: string;
  createdAt: Date;
  createdByName: string;
  createdByCode: string;
  type: keyof typeof ActionType;
  description: string;
  functionType: string;
  functionId: string;
  dataOld?: any;
  dataNew?: any;
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
