import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { FundCycleDto, FundCycleFilterDto, UpdateFundCycleDto } from "@/dto/fund.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_ARRAY: any[] = [];

export const usePaginationFundCycle = (params: PaginationDto<FundCycleFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<FundCycleDto>>({
    queryKey: [API_ENDPOINTS.FUND_CYCLE.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.FUND_CYCLE.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useFundCycleDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch } = useQuery<SuccessResponse<FundCycleDto>>({
    queryKey: [API_ENDPOINTS.FUND_CYCLE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.FUND_CYCLE.FIND_BY_ID, { id });
      return res as SuccessResponse<FundCycleDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch };
};

export const useFundCycleSelectBox = () => {
  const { data, isLoading } = useQuery<FundCycleDto[]>({
    queryKey: [API_ENDPOINTS.FUND_CYCLE.SELECTBOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.FUND_CYCLE.SELECTBOX);
      if (Array.isArray(res)) return res as FundCycleDto[];
      return (res as SuccessResponse<FundCycleDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading };
};

export const useCreateFundCycle = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createFundCycle, isPending } = useMutation({
    mutationFn: (body: any) =>
      rootApiService.post(API_ENDPOINTS.FUND_CYCLE.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND_CYCLE.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Tạo chu kỳ thành công",
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
  return { onCreateFundCycle: createFundCycle, isLoading: isPending };
};

export const useUpdateFundCycle = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate: updateFundCycle, isPending } = useMutation({
    mutationFn: (data: UpdateFundCycleDto) =>
      rootApiService.post(API_ENDPOINTS.FUND_CYCLE.UPDATE, data) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND_CYCLE.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND_CYCLE.FIND_BY_ID] });
      showToast({
        type: "success",
        message: res.message || "Cập nhật chu kỳ thành công",
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
  return { onUpdateFundCycle: updateFundCycle, isLoading: isPending };
};

export const useCloseFundCycle = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onCloseFundCycle, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.FUND_CYCLE.CLOSE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.FUND_CYCLE.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Đóng chu kỳ thành công",
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
  return { onCloseFundCycle, isLoading };
};
