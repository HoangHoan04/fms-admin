import { useToast } from "@/context/ToastContext";
import type {
  CreateTemplateDto,
  NotifyCountResponse,
  NotifyFilterDto,
  NotifyMessageResponse,
  NotifyPaginationDto,
  NotifyPaginationResponse,
  TemplatePaginationDto,
  TemplatePaginationResponse,
  UpdateTemplateDto,
} from "@/dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// ==================== NOTIFICATIONS ====================

export const usePaginationNotification = (params: NotifyPaginationDto) => {
  const { data, isLoading, refetch } = useQuery<NotifyPaginationResponse>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.PAGINATION, params),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

export const useNotificationDetail = (id: string | undefined | null) => {
  const { data, isLoading } = useQuery<any>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.FIND_BY_ID, id],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.FIND_BY_ID, { id }),
    enabled: !!id,
  });
  return { data: data?.data, isLoading };
};

export const useUnreadCount = (filter?: NotifyFilterDto) => {
  const queryKey = filter
    ? [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD, filter]
    : [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD];

  const { data, isLoading, refetch } = useQuery<NotifyCountResponse>({
    queryKey,
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD, filter || {}),
    refetchInterval: 60000,
  });

  return {
    count: data?.count || 0,
    isLoading,
    refetch,
  };
};

export const useMarkReadList = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkReadList, isPending } = useMutation({
    mutationFn: (ids: string[]) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.MARK_LIST_AS_READ, { ids }) as Promise<NotifyMessageResponse>,

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD] });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onMarkReadList, isLoading: isPending };
};

export const useMarkAllRead = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutate: onMarkAllRead, isPending } = useMutation({
    mutationFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.MARK_ALL_READ) as Promise<NotifyMessageResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.COUNT_UNREAD] });
      showToast({ type: "success", message: res.message || "Đã đánh dấu tất cả là đã đọc", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onMarkAllRead, isLoading: isPending };
};

export const useDeleteNotification = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteNotification, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.DELETE, { id }) as Promise<NotifyMessageResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION] });
      showToast({ type: "success", message: res.message || "Xóa thông báo thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onDeleteNotification, isLoading };
};

// ==================== TEMPLATES ====================

export const usePaginationTemplate = (params: TemplatePaginationDto) => {
  const { data, isLoading, refetch } = useQuery<TemplatePaginationResponse>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION_TEMPLATE, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.PAGINATION_TEMPLATE, params),
    placeholderData: (previousData) => previousData,
  });

  return {
    data: data?.data || [],
    total: data?.total || 0,
    isLoading,
    refetch,
  };
};

export const useTemplateDetail = (id: string | undefined | null) => {
  const { data, isLoading } = useQuery<any>({
    queryKey: [API_ENDPOINTS.NOTIFICATION.FIND_TEMPLATE_BY_ID, id],
    queryFn: () => rootApiService.post(API_ENDPOINTS.NOTIFICATION.FIND_TEMPLATE_BY_ID, { id }),
    enabled: !!id,
  });
  return { data: data?.data, isLoading };
};

export const useCreateTemplate = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createTemplate, isPending } = useMutation({
    mutationFn: (body: CreateTemplateDto) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.CREATE_TEMPLATE, body) as Promise<NotifyMessageResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION_TEMPLATE] });
      showToast({ type: "success", message: res.message || "Tạo mẫu thông báo thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onCreateTemplate: createTemplate, isLoading: isPending };
};

export const useUpdateTemplate = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: updateTemplate, isPending } = useMutation({
    mutationFn: (data: UpdateTemplateDto) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.UPDATE_TEMPLATE, data) as Promise<NotifyMessageResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION_TEMPLATE] });
      showToast({ type: "success", message: res.message || "Cập nhật mẫu thông báo thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onUpdateTemplate: updateTemplate, isLoading: isPending };
};

export const useDeleteTemplate = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { mutateAsync: onDeleteTemplate, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.NOTIFICATION.DELETE_TEMPLATE, { id }) as Promise<NotifyMessageResponse>,

    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.NOTIFICATION.PAGINATION_TEMPLATE] });
      showToast({ type: "success", message: res.message || "Xóa mẫu thông báo thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });

  return { onDeleteTemplate, isLoading };
};
