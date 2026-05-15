// import { useToast } from "@/context/ToastContext";
// import { PageResponse, type PaginationDto, type SuccessResponse } from "@/dto";
// import type {
//   CreateTeacherDto,
//   TeacherDto,
//   TeacherFilterDto,
//   UpdateTeacherDto,
// } from "@/dto/teacher.dto";

// import { useRouter } from "@/routers/hooks";
// import rootApiService from "@/services/api.service";
// import { API_ENDPOINTS } from "@/services/endpoint";
// import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// export const usePaginationTeacher = (params: PaginationDto<TeacherFilterDto>) => {
//   const { data, isLoading, refetch, error } = useQuery<PageResponse<TeacherDto>>({
//     queryKey: [API_ENDPOINTS.TEACHER.PAGINATION, params],
//     queryFn: () => rootApiService.post(API_ENDPOINTS.TEACHER.PAGINATION, params),
//   });

//   return {
//     data: data?.data || [],
//     total: data?.total || 0,
//     isLoading,
//     refetch,
//     error,
//   };
// };

// export const useTeacherDetail = (id: string | undefined | null) => {
//   const { data, isLoading, refetch, error } = useQuery<SuccessResponse<TeacherDto>>({
//     queryKey: [API_ENDPOINTS.TEACHER.DETAIL, id],
//     queryFn: async () => {
//       const res = await rootApiService.post(API_ENDPOINTS.TEACHER.DETAIL, {
//         id,
//       });
//       return res as SuccessResponse<TeacherDto>;
//     },
//     enabled: !!id,
//   });

//   return {
//     data: data?.data,
//     isLoading,
//     refetch,
//     error,
//   };
// };

// export const useCreateTeacher = () => {
//   const router = useRouter();
//   const { showToast } = useToast();
//   const queryClient = useQueryClient();

//   const { mutate: createTeacher, isPending } = useMutation({
//     mutationFn: (body: CreateTeacherDto) =>
//       rootApiService.post(API_ENDPOINTS.TEACHER.CREATE, body) as Promise<SuccessResponse>,

//     onSuccess: (res: SuccessResponse) => {
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.PAGINATION],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.SELECT_BOX],
//       });
//       showToast({
//         type: "success",
//         message: res.message || "Tạo teacher thành công",
//         title: "Thành công",
//         timeout: 3000,
//       });
//       router.back();
//     },
//     onError: (error: any) => {
//       showToast({
//         type: "error",
//         message: error?.message || "Có lỗi xảy ra khi tạo teacher",
//         title: "Lỗi",
//         timeout: 3000,
//       });
//     },
//   });

//   const refetch = () => {
//     queryClient.invalidateQueries({
//       queryKey: [API_ENDPOINTS.TEACHER.PAGINATION],
//     });
//   };

//   return { onCreateTeacher: createTeacher, isLoading: isPending, refetch };
// };
// export const useUpdateTeacher = () => {
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const { showToast } = useToast();

//   const { mutate: updateTeacher, isPending } = useMutation({
//     mutationFn: (data: UpdateTeacherDto) => {
//       return rootApiService.post(API_ENDPOINTS.TEACHER.UPDATE, data) as Promise<SuccessResponse>;
//     },
//     onSuccess: (res: SuccessResponse, variables) => {
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.PAGINATION],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.DETAIL, variables.id],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.SELECT_BOX],
//       });
//       showToast({
//         type: "success",
//         message: res.message || "Cập nhật teacher thành công",
//         title: "Thành công",
//         timeout: 3000,
//       });
//       router.back();
//     },
//     onError: (error: any) => {
//       showToast({
//         type: "error",
//         message: error?.message || "Có lỗi xảy ra khi cập nhật teacher",
//         title: "Lỗi",
//         timeout: 3000,
//       });
//     },
//   });

//   return { onUpdateTeacher: updateTeacher, isLoading: isPending };
// };
// export const useActivateTeacher = () => {
//   const queryClient = useQueryClient();
//   const { showToast } = useToast();

//   const { mutateAsync: onActivateTeacher, isPending: isLoading } = useMutation({
//     mutationFn: (id: string) =>
//       rootApiService.post(API_ENDPOINTS.TEACHER.ACTIVATE, {
//         id,
//       }) as Promise<SuccessResponse>,
//     onSuccess: (res: SuccessResponse) => {
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.PAGINATION],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.SELECT_BOX],
//       });
//       showToast({
//         type: "success",
//         message: res.message || "Kích hoạt teacher thành công",
//         title: "Thành công",
//         timeout: 3000,
//       });
//     },
//     onError: (error: any) => {
//       showToast({
//         type: "error",
//         message: error?.message || "Có lỗi xảy ra khi kích hoạt teacher",
//         title: "Lỗi",
//         timeout: 3000,
//       });
//     },
//   });

//   return {
//     onActivateTeacher,
//     isLoading,
//   };
// };
// export const useDeactivateTeacher = () => {
//   const queryClient = useQueryClient();
//   const { showToast } = useToast();

//   const { mutateAsync: onDeactivateTeacher, isPending: isLoading } = useMutation({
//     mutationFn: (id: string) =>
//       rootApiService.post(API_ENDPOINTS.TEACHER.DEACTIVATE, {
//         id,
//       }) as Promise<SuccessResponse>,
//     onSuccess: (res: SuccessResponse) => {
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.PAGINATION],
//       });
//       queryClient.invalidateQueries({
//         queryKey: [API_ENDPOINTS.TEACHER.SELECT_BOX],
//       });
//       showToast({
//         type: "success",
//         message: res.message || "Ngừng hoạt động teacher thành công",
//         title: "Thành công",
//         timeout: 3000,
//       });
//     },
//     onError: (error: any) => {
//       showToast({
//         type: "error",
//         message: error?.message || "Có lỗi xảy ra khi ngừng hoạt động teacher",
//         title: "Lỗi",
//         timeout: 3000,
//       });
//     },
//   });

//   return {
//     isLoading,
//     onDeactivateTeacher,
//   };
// };
// export const useTeacherSelectBox = () => {
//   const { data, isLoading, error } = useQuery<TeacherDto[]>({
//     queryKey: [API_ENDPOINTS.TEACHER.SELECT_BOX],
//     queryFn: () => rootApiService.post(API_ENDPOINTS.TEACHER.SELECT_BOX) as Promise<TeacherDto[]>,
//   });

//   return {
//     data: data || [],
//     isLoading,
//     error,
//   };
// };

// export const useImportTeacherExcel = () => {};

// export const useExportTeacherExcel = () => {};
