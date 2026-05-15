import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateFundDto, FundDto, FundFilterDto, UpdateFundDto } from "@/dto/fund.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationFund = (params: PaginationDto<FundFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<FundDto>>({
    queryKey: [API_ENDPOINTS.FUND.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.FUND.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useFundDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<FundDto>>({
    queryKey: [API_ENDPOINTS.FUND.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.FUND.FIND_BY_ID, { id });
      return res as SuccessResponse<FundDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useCreateFund = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createFund, isPending } = useMutation({
    mutationFn: (body: CreateFundDto) =>
      rootApiService.post(API_ENDPOINTS.FUND.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Tạo quỹ thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });
  return { onCreateFund: createFund, isLoading: isPending };
};

export const useUpdateFund = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: updateFund, isPending } = useMutation({
    mutationFn: (data: UpdateFundDto) =>
      rootApiService.post(API_ENDPOINTS.FUND.UPDATE, data) as Promise<SuccessResponse>,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND.FIND_BY_ID, variables.id] });
      showToast({
        type: "success",
        message: res.message || "Cập nhật quỹ thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });
  return { onUpdateFund: updateFund, isLoading: isPending };
};

export const useActivateFund = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onActivateFund, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.FUND.ACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt quỹ thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });
  return { onActivateFund, isLoading };
};

export const useDeactivateFund = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onDeactivateFund, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.FUND.DEACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động quỹ thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });
  return { onDeactivateFund, isLoading };
};

export const useFundSelectBox = () => {
  const { data, isLoading, error } = useQuery<FundDto[]>({
    queryKey: [API_ENDPOINTS.FUND.SELECTBOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.FUND.SELECTBOX);
      if (Array.isArray(res)) return res as FundDto[];
      return (res as SuccessResponse<FundDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading, error };
};
