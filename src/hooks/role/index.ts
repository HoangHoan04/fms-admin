import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateRoleDto, RoleDto, RoleFilterDto, UpdateRoleDto } from "@/dto/role.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationRole = (params: PaginationDto<RoleFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<RoleDto>>({
    queryKey: [API_ENDPOINTS.ROLE.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.ROLE.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

export const useRoleDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<RoleDto>>({
    queryKey: [API_ENDPOINTS.ROLE.DETAIL, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.ROLE.DETAIL, {
        id,
      });
      return res as SuccessResponse<RoleDto>;
    },
    enabled: !!id,
  });

  return {
    data: data?.data,
    isLoading,
    refetch,
    error,
  };
};

export const useCreateRole = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createRole, isPending } = useMutation({
    mutationFn: (body: CreateRoleDto) =>
      rootApiService.post(API_ENDPOINTS.ROLE.CREATE, body) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo vai trò thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo vai trò",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onCreateRole: createRole, isLoading: isPending };
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updateRole, isPending } = useMutation({
    mutationFn: (data: UpdateRoleDto) => {
      return rootApiService.post(API_ENDPOINTS.ROLE.UPDATE, data) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.DETAIL, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật vai trò thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật vai trò",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdateRole: updateRole, isLoading: isPending };
};

export const useActivateRole = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivateRole, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.ROLE.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt vai trò thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt vai trò",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivateRole,
    isLoading,
  };
};

export const useDeactivateRole = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivateRole, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.ROLE.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động vai trò thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động vai trò",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    isLoading,
    onDeactivateRole,
  };
};

export const useRoleSelectBox = () => {
  const { data, isLoading, error } = useQuery<RoleDto[]>({
    queryKey: [API_ENDPOINTS.ROLE.SELECT_BOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.ROLE.SELECT_BOX);
      if (Array.isArray(res)) return res as RoleDto[];
      return (res as SuccessResponse<RoleDto[]>).data || [];
    },
  });

  return {
    data: data || EMPTY_ARRAY,
    isLoading,
    error,
  };
};
