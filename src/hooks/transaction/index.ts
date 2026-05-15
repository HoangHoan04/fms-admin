import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { BalanceDto, TransactionDto, TransactionFilterDto } from "@/dto/transaction.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useQuery } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationTransaction = (params: PaginationDto<TransactionFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<TransactionDto>>({
    queryKey: [API_ENDPOINTS.TRANSACTION.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.TRANSACTION.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useFundBalance = () => {
  const { data, isLoading, refetch } = useQuery<BalanceDto[]>({
    queryKey: [API_ENDPOINTS.TRANSACTION.BALANCE],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.TRANSACTION.BALANCE);
      if (Array.isArray(res)) return res as BalanceDto[];
      return (res as SuccessResponse<BalanceDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading, refetch };
};
