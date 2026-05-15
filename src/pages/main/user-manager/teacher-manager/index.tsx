// import { ROUTES } from "@/common/constants";
// import { enumData } from "@/common/enums";
// import {
//   type ActionConfirmRef,
//   type FilterField,
//   type TableColumn,
//   StatusTag,
//   type RowAction,
//   BaseView,
//   FilterComponent,
//   TableCustom,
//   RowActions,
//   CommonActions,
//   ActionConfirm,
// } from "@/components/ui";
// import type { TeacherFilterDto, PaginationDto, TeacherDto } from "@/dto";
// import { usePaginationTeacher, useDeactivateTeacher, useActivateTeacher } from "@/hooks/teacher";
// import { useRouter } from "@/routers/hooks";
// import { PrimeIcons } from "primereact/api";
// import { useState, useRef } from "react";

// export const initFilter: TeacherFilterDto = {
//   code: "",
//   fullName: "",
//   email: "",
//   phone: "",
//   gender: "",
//   isDeleted: null,
// };

// export default function TeacherManager() {
//   const router = useRouter();
//   const [filter, setFilter] = useState<TeacherFilterDto>(initFilter);
//   const [pagination, setPagination] = useState<PaginationDto<TeacherFilterDto>>({
//     skip: 0,
//     take: 10,
//     where: initFilter,
//   });
//   const [selectedRows, setSelectedRows] = useState<TeacherDto[]>([]);
//   const [selectedTeacher, setSelectedTeacher] = useState<TeacherDto | null>(null);
//   const activateConfirmRef = useRef<ActionConfirmRef>(null);
//   const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

//   const { data, isLoading, refetch, total } = usePaginationTeacher(pagination);
//   const { onDeactivateTeacher, isLoading: isLoadingDeactivate } = useDeactivateTeacher();
//   const { onActivateTeacher, isLoading: isLoadingActivate } = useActivateTeacher();

//   const handleSearch = (isReset?: boolean) => {
//     setPagination((prev) => ({
//       ...prev,
//       skip: 0,
//       where: isReset ? initFilter : { ...prev.where, ...filter },
//     }));
//     if (isReset) setFilter(initFilter);
//   };

//   const handleFiltersChange = (newFilters: Record<string, any>) => {
//     setFilter(newFilters as TeacherFilterDto);
//   };

//   const handlePageChange = (page: number, pageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//     }));
//   };

//   const handleActivate = async () => {
//     if (!selectedTeacher) return;
//     await onActivateTeacher(selectedTeacher.id);
//     await refetch();
//     setSelectedTeacher(null);
//   };

//   const handleDeactivate = async () => {
//     if (!selectedTeacher) return;
//     await onDeactivateTeacher(selectedTeacher.id);
//     await refetch();
//     setSelectedTeacher(null);
//   };

//   const handleCreate = () => {
//     router.push(ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.ADD_TEACHER.path);
//   };

//   /** Xuất toàn bộ dữ liệu trang hiện tại ra Excel */
//   const handleExportExcel = async () => {};

//   /** Tải file mẫu Excel để nhập dữ liệu */
//   const handleDownloadTemplate = async () => {};

//   const handleImportExcel = async () => {};

//   const filterFields: FilterField[] = [
//     {
//       key: "code",
//       label: "Mã giảng viên",
//       type: "input",
//       placeholder: "Nhập mã giảng viên",
//       col: 8,
//     },
//     {
//       key: "fullName",
//       label: "Tên giảng viên",
//       type: "input",
//       placeholder: "Nhập tên giảng viên",
//       col: 8,
//     },
//     {
//       key: "email",
//       label: "Email giảng viên",
//       type: "input",
//       placeholder: "Nhập email giảng viên",
//       col: 8,
//     },
//     {
//       key: "phone",
//       label: "Số điện thoại giảng viên",
//       type: "input",
//       placeholder: "Nhập số điện thoại giảng viên",
//       col: 8,
//     },
//     {
//       key: "gender",
//       label: "Giới tính",
//       type: "select",
//       options: Object.values(enumData.GENDER || {}).map((item: any) => ({
//         label: item.name,
//         value: item.code,
//       })),
//       placeholder: "Chọn giới tính",
//       col: 8,
//     },
//     {
//       key: "isDeleted",
//       label: "Trạng thái",
//       type: "select",
//       options: Object.values(enumData.STATUS_FILTER || {}).map((item: any) => ({
//         label: item.name,
//         value: item.code,
//       })),
//       placeholder: "Chọn trạng thái",
//       col: 8,
//     },
//   ];

//   const columns: TableColumn<TeacherDto>[] = [
//     {
//       field: "code",
//       header: "Mã giảng viên",
//       width: 120,
//       sortable: true,
//       frozen: true,
//     },
//     {
//       field: "fullName",
//       header: "Tên giảng viên",
//       width: 200,
//       sortable: true,
//     },
//     {
//       field: "gender",
//       header: "Giới tính",
//       width: 150,
//       sortable: true,
//       render: (rowData: TeacherDto) => {
//         const gender = enumData.GENDER[rowData.gender as keyof typeof enumData.GENDER];
//         return gender ? gender.name : "";
//       },
//     },
//     {
//       field: "email",
//       header: "Email giảng viên",
//       width: 200,
//       sortable: true,
//     },
//     {
//       field: "phone",
//       header: "Số điện thoại",
//       width: 150,
//       sortable: true,
//     },

//     {
//       field: "isDeleted",
//       header: "Hoạt động",
//       width: 150,
//       align: "center",
//       body: (rowData: TeacherDto) => (
//         <StatusTag
//           severity={rowData.isDeleted ? "danger" : "success"}
//           value={
//             rowData.isDeleted
//               ? enumData.STATUS_FILTER.INACTIVE.name
//               : enumData.STATUS_FILTER.ACTIVE.name
//           }
//         />
//       ),
//     },
//   ];

//   const rowActions: RowAction<TeacherDto>[] = [
//     {
//       key: "view",
//       icon: PrimeIcons.EYE,
//       tooltip: "Xem chi tiết",
//       severity: "info",
//       onClick: (record) =>
//         router.push(
//           ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.DETAIL_TEACHER.path.replace(
//             ":id",
//             record.id,
//           ),
//         ),
//     },
//     {
//       key: "edit",
//       icon: PrimeIcons.PENCIL,
//       tooltip: "Chỉnh sửa",
//       severity: "success",
//       visible: (record) => !record.isDeleted,
//       onClick: (record) => {
//         router.push(
//           ROUTES.MAIN.USER_MANAGER.children.TEACHER_MANAGER.children.EDIT_TEACHER.path.replace(
//             ":id",
//             record.id,
//           ),
//         );
//       },
//     },
//     {
//       key: "changePassword",
//       icon: PrimeIcons.KEY,
//       tooltip: "Đổi mật khẩu",
//       severity: "info",
//       onClick: () => {},
//     },
//     {
//       key: "deactivate",
//       icon: PrimeIcons.BAN,
//       tooltip: "Ngưng hoạt động",
//       severity: "warning",
//       visible: (record) => !record.isDeleted,
//       onClick: (record) => {
//         setSelectedTeacher(record);
//         deactivateConfirmRef.current?.show();
//       },
//     },
//     {
//       key: "activate",
//       icon: PrimeIcons.CHECK_CIRCLE,
//       tooltip: "Kích hoạt",
//       severity: "success",
//       visible: (record) => record.isDeleted,
//       onClick: (record) => {
//         setSelectedTeacher(record);
//         activateConfirmRef.current?.show();
//       },
//     },
//   ];

//   return (
//     <BaseView>
//       <FilterComponent
//         fields={filterFields}
//         filters={filter}
//         onFiltersChange={handleFiltersChange}
//         onSearch={() => handleSearch(false)}
//         onClear={() => handleSearch(true)}
//       />

//       <TableCustom<TeacherDto>
//         data={data || []}
//         columns={columns}
//         loading={isLoading || isLoadingActivate || isLoadingDeactivate}
//         enableSelection={true}
//         selectedRows={selectedRows}
//         onSelectionChange={setSelectedRows}
//         rowActions={rowActions}
//         stripedRows={true}
//         showGridlines={true}
//         scrollable={true}
//         emptyText="Không tìm thấy teacher nào"
//         pagination={{
//           current: Math.floor(pagination.skip / pagination.take) + 1,
//           pageSize: pagination.take,
//           total: total || 0,
//           showTotal: true,
//         }}
//         onPageChange={handlePageChange}
//         toolbar={{
//           show: true,
//           align: "between",
//           leftContent: (
//             <>
//               <RowActions
//                 actions={[CommonActions.create(handleCreate)]}
//                 justify="start"
//                 gap="medium"
//               />

//               <RowActions
//                 actions={[CommonActions.exportExcel(handleExportExcel)]}
//                 justify="start"
//                 gap="medium"
//               />

//               <RowActions
//                 actions={[CommonActions.uploadExcel(handleDownloadTemplate, handleImportExcel)]}
//                 justify="start"
//                 gap="medium"
//               />
//             </>
//           ),
//           showRefreshButton: true,
//           onRefresh: refetch,
//         }}
//       />

//       <ActionConfirm
//         ref={activateConfirmRef}
//         title="Xác nhận kích hoạt teacher"
//         confirmText="Kích hoạt"
//         cancelText="Hủy"
//         onConfirm={handleActivate}
//       />

//       <ActionConfirm
//         ref={deactivateConfirmRef}
//         title="Xác nhận ngừng hoạt động teacher"
//         confirmText="Ngừng hoạt động"
//         cancelText="Hủy"
//         withReason={true}
//         isRequireReason={true}
//         onConfirm={handleDeactivate}
//       />
//     </BaseView>
//   );
// }
