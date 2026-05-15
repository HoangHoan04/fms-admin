import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type {
  AssignPermissionsToRoleDto,
  CreatePermissionDto,
  PermissionDto,
  PermissionFilterDto,
  RolePermissionDto,
  UpdatePermissionDto,
} from "@/dto/permission.dto";

import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationPermission = (params: PaginationDto<PermissionFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<PermissionDto>>({
    queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.PERMISSION.PAGINATION, params),
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

export const usePermissionDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<PermissionDto>>({
    queryKey: [API_ENDPOINTS.PERMISSION.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.PERMISSION.FIND_BY_ID, {
        id,
      });
      return res as SuccessResponse<PermissionDto>;
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

export const useCreatePermission = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createPermission, isPending } = useMutation({
    mutationFn: (body: CreatePermissionDto) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.CREATE, body) as Promise<SuccessResponse>,

    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Tạo quyền thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi tạo quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onCreatePermission: createPermission, isLoading: isPending };
};

export const useUpdatePermission = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();

  const { mutate: updatePermission, isPending } = useMutation({
    mutationFn: (data: UpdatePermissionDto) => {
      return rootApiService.post(API_ENDPOINTS.PERMISSION.UPDATE, data) as Promise<SuccessResponse>;
    },
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.FIND_BY_ID, variables.id],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Cập nhật quyền thành công",
        title: "Thành công",
        timeout: 3000,
      });
      router.back();
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi cập nhật quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return { onUpdatePermission: updatePermission, isLoading: isPending };
};

export const useActivatePermission = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onActivatePermission, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.ACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Kích hoạt quyền thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi kích hoạt quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onActivatePermission,
    isLoading,
  };
};

export const useDeactivatePermission = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeactivatePermission, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.DEACTIVATE, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
      });
      showToast({
        type: "success",
        message: res.message || "Ngừng hoạt động quyền thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    isLoading,
    onDeactivatePermission,
  };
};

export const usePermissionSelectBox = () => {
  const { data, isLoading, error } = useQuery<PermissionDto[]>({
    queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.PERMISSION.SELECT_BOX);
      if (Array.isArray(res)) return res as PermissionDto[];
      return (res as SuccessResponse<PermissionDto[]>).data || [];
    },
  });

  return {
    data: data || EMPTY_ARRAY,
    isLoading,
    error,
  };
};

export const usePermissionsByRole = (roleId: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<RolePermissionDto[]>({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_ROLE, roleId],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_ROLE, {
        roleId,
      });
      if (Array.isArray(res)) return res as RolePermissionDto[];
      return (res as SuccessResponse<RolePermissionDto[]>).data || [];
    },
    enabled: !!roleId,
  });

  return {
    data: data || (EMPTY_ARRAY as RolePermissionDto[]),
    isLoading,
    refetch,
    error,
  };
};

export interface ModuleActionInfo {
  module: string;
  actions: string[];
}

export const useModuleActions = () => {
  const { data, isLoading, refetch } = useQuery<ModuleActionInfo[]>({
    queryKey: [API_ENDPOINTS.PERMISSION.GET_MODULE_ACTIONS],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.PERMISSION.GET_MODULE_ACTIONS);
      if (Array.isArray(res)) return res as ModuleActionInfo[];
      return (res as SuccessResponse<ModuleActionInfo[]>).data || [];
    },
  });

  return {
    data: data || (EMPTY_ARRAY as ModuleActionInfo[]),
    isLoading,
    refetch,
  };
};

export const useSyncPermissions = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onSyncPermissions, isPending: isLoading } = useMutation({
    mutationFn: () =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.SYNC_PERMISSIONS) as Promise<
        SuccessResponse & { created: number; skipped: number }
      >,
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.PAGINATION],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.SELECT_BOX],
      });
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_MODULE_ACTIONS],
      });
      showToast({
        type: "success",
        message: `Đã tạo ${res.created} quyền mới, bỏ qua ${res.skipped} quyền đã tồn tại`,
        title: "Đồng bộ thành công",
        timeout: 5000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi đồng bộ quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onSyncPermissions,
    isLoading,
  };
};

export interface UserPermissionDto {
  id: string;
  userId: string;
  permissionId: string;
  grantType: "Allow" | "Deny";
  reason?: string;
  expiresAt?: string;
  permission: PermissionDto;
}

export const usePermissionsByUser = (userId: string | undefined | null) => {
  const { data, isLoading, refetch } = useQuery<UserPermissionDto[]>({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_USER, userId],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_USER, { userId });
      if (Array.isArray(res)) return res as UserPermissionDto[];
      return (res as SuccessResponse<UserPermissionDto[]>).data || [];
    },
    enabled: !!userId,
  });

  return {
    data: data || (EMPTY_ARRAY as UserPermissionDto[]),
    isLoading,
    refetch,
  };
};

export const useAssignPermissionToUser = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onAssignToUser, isPending: isLoading } = useMutation({
    mutationFn: (data: {
      userId: string;
      permissionId: string;
      grantType: "Allow" | "Deny";
      reason?: string;
    }) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.ASSIGN_TO_USER, data) as Promise<SuccessResponse>,
    onSuccess: (_res, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_USER, variables.userId],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Cập nhật quyền đặc biệt thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra",
        timeout: 3000,
      });
    },
  });

  return { onAssignToUser, isLoading };
};

export const useRemoveUserPermission = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onRemoveUserPermission, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.REMOVE_FROM_USER, {
        id,
      }) as Promise<SuccessResponse>,
    onSuccess: (_res) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_USER],
      });
      showToast({
        type: "success",
        title: "Thành công",
        message: "Đã thu hồi quyền đặc biệt",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        title: "Lỗi",
        message: error?.message || "Có lỗi xảy ra",
        timeout: 3000,
      });
    },
  });

  return { onRemoveUserPermission, isLoading };
};

export const useAssignPermissionsToRole = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onAssignPermissionsToRole, isPending: isLoading } = useMutation({
    mutationFn: (data: AssignPermissionsToRoleDto) =>
      rootApiService.post(API_ENDPOINTS.PERMISSION.ASSIGN_TO_ROLE, data) as Promise<SuccessResponse>,
    onSuccess: (res: SuccessResponse, variables) => {
      queryClient.invalidateQueries({
        queryKey: [API_ENDPOINTS.PERMISSION.GET_PERMISSION_BY_ROLE, variables.roleId],
      });
      showToast({
        type: "success",
        message: res.message || "Gán quyền cho vai trò thành công",
        title: "Thành công",
        timeout: 3000,
      });
    },
    onError: (error: any) => {
      showToast({
        type: "error",
        message: error?.message || "Có lỗi xảy ra khi gán quyền",
        title: "Lỗi",
        timeout: 3000,
      });
    },
  });

  return {
    onAssignPermissionsToRole,
    isLoading,
  };
};
