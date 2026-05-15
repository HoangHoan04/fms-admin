import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateReceiptDto, ReceiptDto, ReceiptFilterDto } from "@/dto/receipt.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const usePaginationReceipt = (params: PaginationDto<ReceiptFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<ReceiptDto>>({
    queryKey: [API_ENDPOINTS.RECEIPT.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.RECEIPT.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useReceiptDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<ReceiptDto>>({
    queryKey: [API_ENDPOINTS.RECEIPT.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.RECEIPT.FIND_BY_ID, { id });
      return res as SuccessResponse<ReceiptDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useCreateReceipt = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createReceipt, isPending } = useMutation({
    mutationFn: (body: CreateReceiptDto) =>
      rootApiService.post(API_ENDPOINTS.RECEIPT.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECEIPT.PAGINATION] });
      showToast({ type: "success", message: res.message || "Tạo biên lai thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onCreateReceipt: createReceipt, isLoading: isPending };
};

export const useApproveReceipt = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onApproveReceipt, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.RECEIPT.APPROVE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECEIPT.PAGINATION] });
      showToast({ type: "success", message: res.message || "Phê duyệt biên lai thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onApproveReceipt, isLoading };
};

export const useRejectReceipt = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onRejectReceipt, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.RECEIPT.REJECT, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.RECEIPT.PAGINATION] });
      showToast({ type: "success", message: res.message || "Từ chối biên lai thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onRejectReceipt, isLoading };
};
