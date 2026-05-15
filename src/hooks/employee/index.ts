import { useToast } from "@/context/ToastContext";
import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
import type { CreateEmployeeDto, EmployeeDto, EmployeeFilterDto, UpdateEmployeeDto } from "@/dto/employee.dto";
import { useRouter } from "@/routers/hooks";
import rootApiService from "@/services/api.service";
import { API_ENDPOINTS } from "@/services/endpoint";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const EMPTY_ARRAY: any[] = [];

export const usePaginationEmployee = (params: PaginationDto<EmployeeFilterDto>) => {
  const { data, isLoading, refetch } = useQuery<PageResponse<EmployeeDto>>({
    queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION, params],
    queryFn: () => rootApiService.post(API_ENDPOINTS.EMPLOYEE.PAGINATION, params),
  });
  return { data: data?.data || [], total: data?.total || 0, isLoading, refetch };
};

export const useEmployeeDetail = (id: string | undefined | null) => {
  const { data, isLoading, refetch, error } = useQuery<SuccessResponse<EmployeeDto>>({
    queryKey: [API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, id],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, { id });
      return res as SuccessResponse<EmployeeDto>;
    },
    enabled: !!id,
  });
  return { data: data?.data, isLoading, refetch, error };
};

export const useCreateEmployee = () => {
  const router = useRouter();
  const { showToast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createEmployee, isPending } = useMutation({
    mutationFn: (body: CreateEmployeeDto) =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.CREATE, body) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION] });
      showToast({ type: "success", message: res.message || "Tạo nhân viên thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onCreateEmployee: createEmployee, isLoading: isPending };
};

export const useUpdateEmployee = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { showToast } = useToast();
  const { mutate: updateEmployee, isPending } = useMutation({
    mutationFn: (data: UpdateEmployeeDto) =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.UPDATE, data) as Promise<SuccessResponse>,
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION] });
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.EMPLOYEE.FIND_BY_ID, variables.id] });
      showToast({ type: "success", message: res.message || "Cập nhật nhân viên thành công", title: "Thành công", timeout: 3000 });
      router.back();
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onUpdateEmployee: updateEmployee, isLoading: isPending };
};

export const useActivateEmployee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onActivateEmployee, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.ACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION] });
      showToast({ type: "success", message: res.message || "Kích hoạt nhân viên thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onActivateEmployee, isLoading };
};

export const useDeactivateEmployee = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const { mutateAsync: onDeactivateEmployee, isPending: isLoading } = useMutation({
    mutationFn: (id: string) =>
      rootApiService.post(API_ENDPOINTS.EMPLOYEE.DEACTIVATE, { id }) as Promise<SuccessResponse>,
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: [API_ENDPOINTS.EMPLOYEE.PAGINATION] });
      showToast({ type: "success", message: res.message || "Ngừng hoạt động nhân viên thành công", title: "Thành công", timeout: 3000 });
    },
    onError: (error: any) => {
      showToast({ type: "error", message: error?.message || "Có lỗi xảy ra", title: "Lỗi", timeout: 3000 });
    },
  });
  return { onDeactivateEmployee, isLoading };
};

export const useEmployeeSelectBox = () => {
  const { data, isLoading, error } = useQuery<EmployeeDto[]>({
    queryKey: [API_ENDPOINTS.EMPLOYEE.SELECTBOX],
    queryFn: async () => {
      const res = await rootApiService.post(API_ENDPOINTS.EMPLOYEE.SELECTBOX);
      if (Array.isArray(res)) return res as EmployeeDto[];
      return (res as SuccessResponse<EmployeeDto[]>).data || [];
    },
  });
  return { data: data || EMPTY_ARRAY, isLoading, error };
};
