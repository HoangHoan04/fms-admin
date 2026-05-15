import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateMemberDto, MemberDto, MemberFilterDto, UpdateMemberDto } from "@/dto/member.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationMember = (params: PaginationDto<MemberFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<MemberDto>>({
    queryKey: [API_ENDPOINTS.MEMBER.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.MEMBER.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useMemberDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<MemberDto>>({
    queryKey: [API_ENDPOINTS.MEMBER.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.MEMBER.FIND_BY_ID, { id });
      return res as SuccessResponse<MemberDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useCreateMember = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createMember, isPending } = useMutation({
    mutationFn: (body: CreateMemberDto) =>
      rootApiService.post(API_ENDPOINTS.MEMBER.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MEMBER.PAGINATION] });
      showToast({ type: "success", message: res.message || "Tạo thành viên thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onCreateMember: createMember, isLoading: isPending };
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: updateMember, isPending } = useMutation({
    mutationFn: (data: UpdateMemberDto) =>
      rootApiService.post(API_ENDPOINTS.MEMBER.UPDATE, data) as Promise<SuccessResponse>,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MEMBER.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MEMBER.FIND_BY_ID, variables.id] });
      showToast({ type: "success", message: res.message || "Cập nhật thành viên thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onUpdateMember: updateMember, isLoading: isPending };
};

export const useActivateMember = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onActivateMember, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.MEMBER.ACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MEMBER.PAGINATION] });
      showToast({ type: "success", message: res.message || "Kích hoạt thành viên thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onActivateMember, isLoading };
};

export const useDeactivateMember = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onDeactivateMember, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.MEMBER.DEACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.MEMBER.PAGINATION] });
      showToast({ type: "success", message: res.message || "Ngừng hoạt động thành viên thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onDeactivateMember, isLoading };
};

export const useMemberSelectBox = () => {
  const { data, isLoading, error } = useQuery<MemberDto[]>({
    queryKey: [API_ENDPOINTS.MEMBER.SELECTBOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.MEMBER.SELECTBOX);
      if (Array.isArray(res)) return res as MemberDto[];
      return (res as SuccessResponse<MemberDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading, error };
};
