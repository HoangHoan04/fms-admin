import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  ContributionDto,
  ContributionFilterDto,
  CreateContributionDto,
  UpdateContributionDto,
} from "@/dto/contribution.dto";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const EMPTY_ARRAY: any[] = [];

export const usePaginationContribution = (params: PaginationDto<ContributionFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<ContributionDto>>({
    queryKey: [API_ENDPOINTS.CONTRIBUTION.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.CONTRIBUTION.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useContributionDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<ContributionDto>>({
    queryKey: [API_ENDPOINTS.CONTRIBUTION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.CONTRIBUTION.FIND_BY_ID, { id });
      return res as SuccessResponse<ContributionDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useContributionSelectBox = () => {
  const { data, isLoading } = useQuery<ContributionDto[]>({
    queryKey: [API_ENDPOINTS.CONTRIBUTION.SELECTBOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.CONTRIBUTION.SELECTBOX);
      if (Array.isArray(res)) return res as ContributionDto[];
      return (res as SuccessResponse<ContributionDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading };
};

export const useCreateContribution = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createContribution, isPending } = useMutation({
    mutationFn: (body: CreateContributionDto) =>
      rootApiService.post(API_ENDPOINTS.CONTRIBUTION.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CONTRIBUTION.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Tạo đóng góp thành công",
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
  return { onCreateContribution: createContribution, isLoading: isPending };
};

export const useUpdateContribution = () => {
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: updateContribution, isPending } = useMutation({
    mutationFn: (data: UpdateContributionDto) =>
      rootApiService.post(API_ENDPOINTS.CONTRIBUTION.UPDATE, data) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CONTRIBUTION.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Cập nhật đóng góp thành công",
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
  return { onUpdateContribution: updateContribution, isLoading: isPending };
};

export const useConfirmContribution = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onConfirmContribution, isPending: isLoading } = useMutation({
    mutationFn: (data: any) =>
      rootApiService.post(API_ENDPOINTS.CONTRIBUTION.CONFIRM, data) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.CONTRIBUTION.PAGINATION] });
      showToast({
        type: "success",
        message: res.message || "Xác nhận đóng góp thành công",
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
  return { onConfirmContribution, isLoading };
};
