import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateDisbursementDto, DisbursementDto, DisbursementFilterDto } from "@/dto/disbursement.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationDisbursement = (params: PaginationDto<DisbursementFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<DisbursementDto>>({
    queryKey: [API_ENDPOINTS.DISBURSEMENT.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.DISBURSEMENT.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useDisbursementDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<DisbursementDto>>({
    queryKey: [API_ENDPOINTS.DISBURSEMENT.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.DISBURSEMENT.FIND_BY_ID, { id });
      return res as SuccessResponse<DisbursementDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useCreateDisbursement = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createDisbursement, isPending } = useMutation({
    mutationFn: (body: CreateDisbursementDto) =>
      rootApiService.post(API_ENDPOINTS.DISBURSEMENT.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DISBURSEMENT.PAGINATION] });
      showToast({ type: "success", message: res.message || "Tạo giải ngân thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onCreateDisbursement: createDisbursement, isLoading: isPending };
};

export const useConfirmDisbursement = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onConfirmDisbursement, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.DISBURSEMENT.CONFIRM, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.DISBURSEMENT.PAGINATION] });
      showToast({ type: "success", message: res.message || "Xác nhận giải ngân thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onConfirmDisbursement, isLoading };
};
