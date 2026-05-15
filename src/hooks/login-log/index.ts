import { PageResponse, type PaginationDto } from "@/dto";
import type { LoginLogDto, LoginLogFilterDto } from "@/dto/login-log.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";

export const usePaginationLoginLog = (params: PaginationDto<LoginLogFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<LoginLogDto>>({
    queryKey: [API_ENDPOINTS.LOGIN_LOG.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.LOGIN_LOG.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};
