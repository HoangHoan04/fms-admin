// import { ROUTES } from "@/common/constants";
// import { enumData } from "@/common/enums";
// import {
//   type ActionConfirmRef,
//   type FilterField,
//   type TableColumn,
//   type RowAction,
//   BaseView,
//   FilterComponent,
//   TableCustom,
//   PermissionGate,
//   RowActions,
//   CommonActions,
//   ActionConfirm,
//   StatusTag,
// } from "@/components/ui";
// import type { StudentFilterDto, PaginationDto, StudentDto } from "@/dto";
// import { usePermission } from "@/hooks/layout/usePermission";
// import { usePaginationStudent, useDeactivateStudent, useActivateStudent } from "@/hooks/student";
// import { useRouter } from "@/routers/hooks";
// import { PrimeIcons } from "primereact/api";
// import { useState, useRef, useMemo } from "react";

// export const initFilter: StudentFilterDto = {
//   code: "",
//   fullName: "",
//   email: "",
//   phone: "",
//   gender: "",
//   isDeleted: null,
// };

// export default function StudentManager() {
//   const router = useRouter();
//   const { hasPermission } = usePermission();
//   const [filter, setFilter] = useState<StudentFilterDto>(initFilter);
//   const [pagination, setPagination] = useState<PaginationDto<StudentFilterDto>>({
//     skip: 0,
//     take: 10,
//     where: initFilter,
//   });
//   const [selectedRows, setSelectedRows] = useState<StudentDto[]>([]);
//   const [selectedStudent, setSelectedStudent] = useState<StudentDto | null>(null);
//   const activateConfirmRef = useRef<ActionConfirmRef>(null);
//   const deactivateConfirmRef = useRef<ActionConfirmRef>(null);

//   const { data, isLoading, refetch, total } = usePaginationStudent(pagination);
//   const { onDeactivateStudent, isLoading: isLoadingDeactivate } = useDeactivateStudent();
//   const { onActivateStudent, isLoading: isLoadingActivate } = useActivateStudent();

//   const handleSearch = (isReset?: boolean) => {
//     setPagination((prev) => ({
//       ...prev,
//       skip: 0,
//       where: isReset ? initFilter : { ...prev.where, ...filter },
//     }));
//     if (isReset) setFilter(initFilter);
//   };

//   const handleFiltersChange = (newFilters: Record<string, any>) => {
//     setFilter(newFilters as StudentFilterDto);
//   };

//   const handlePageChange = (page: number, pageSize: number) => {
//     setPagination((prev) => ({
//       ...prev,
//       skip: (page - 1) * pageSize,
//       take: pageSize,
//     }));
//   };

//   const handleActivate = async () => {
//     if (!selectedStudent) return;
//     await onActivateStudent(selectedStudent.id);
//     await refetch();
//     setSelectedStudent(null);
//   };

//   const handleDeactivate = async () => {
//     if (!selectedStudent) return;
//     await onDeactivateStudent(selectedStudent.id);
//     await refetch();
//     setSelectedStudent(null);
//   };

//   const handleCreate = () => {
//     router.push(ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.ADD_STUDENT.path);
//   };

//   /** Xuất toàn bộ dữ liệu trang hiện tại ra Excel */
//   const handleExportExcel = async () => {};

//   /** Tải file mẫu Excel để nhập dữ liệu */
//   const handleDownloadTemplate = async () => {};

//   const handleImportExcel = async () => {};

//   const filterFields: FilterField[] = [
//     {
//       key: "code",
//       label: "Mã học viên",
//       type: "input",
//       placeholder: "Nhập mã học viên",
//       col: 8,
//     },
//     {
//       key: "fullName",
//       label: "Tên học viên",
//       type: "input",
//       placeholder: "Nhập tên học viên",
//       col: 8,
//     },
//     {
//       key: "email",
//       label: "Email học viên",
//       type: "input",
//       placeholder: "Nhập email học viên",
//       col: 8,
//     },
//     {
//       key: "phone",
//       label: "Số điện thoại học viên",
//       type: "input",
//       placeholder: "Nhập số điện thoại học viên",
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
//         code: item.code,
//         label: item.name,
//         value: item.value,
//       })),
//       placeholder: "Chọn trạng thái",
//       col: 8,
//     },
//   ];

//   const columns: TableColumn<StudentDto>[] = [
//     {
//       field: "code",
//       header: "Mã học viên",
//       width: 120,
//       sortable: true,
//       frozen: true,
//     },
//     {
//       field: "fullName",
//       header: "Tên học viên",
//       width: 200,
//       sortable: true,
//     },
//     {
//       field: "gender",
//       header: "Giới tính",
//       width: 150,
//       sortable: true,
//       render: (rowData: StudentDto) => {
//         const gender = enumData.GENDER[rowData.gender as keyof typeof enumData.GENDER];
//         return gender ? gender.name : "";
//       },
//     },
//     {
//       field: "email",
//       header: "Email học viên",
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
//       body: (rowData: StudentDto) => (
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

//   const rowActions: RowAction<StudentDto>[] = useMemo(
//     () => [
//       {
//         key: "view",
//         icon: PrimeIcons.EYE,
//         tooltip: "Xem chi tiết",
//         severity: "info",
//         visible: () => hasPermission("STUDENT:VIEW_DETAIL"),
//         onClick: (record) =>
//           router.push(
//             ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.DETAIL_STUDENT.path.replace(
//               ":id",
//               record.id,
//             ),
//           ),
//       },
//       {
//         key: "edit",
//         icon: PrimeIcons.PENCIL,
//         tooltip: "Chỉnh sửa",
//         severity: "success",
//         visible: (record) => hasPermission("STUDENT:EDITED") && !record.isDeleted,
//         onClick: (record) => {
//           router.push(
//             ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.EDIT_STUDENT.path.replace(
//               ":id",
//               record.id,
//             ),
//           );
//         },
//       },
//       {
//         key: "changePassword",
//         icon: PrimeIcons.KEY,
//         tooltip: "Đổi mật khẩu",
//         severity: "info",
//         visible: () => hasPermission("STUDENT:EDITED"),
//         onClick: () => {},
//       },
//       {
//         key: "deactivate",
//         icon: PrimeIcons.BAN,
//         tooltip: "Ngưng hoạt động",
//         severity: "warning",
//         visible: (record) => hasPermission("STUDENT:DEACTIVATED") && !record.isDeleted,
//         onClick: (record) => {
//           setSelectedStudent(record);
//           deactivateConfirmRef.current?.show();
//         },
//       },
//       {
//         key: "activate",
//         icon: PrimeIcons.CHECK_CIRCLE,
//         tooltip: "Kích hoạt",
//         severity: "success",
//         visible: (record) => hasPermission("STUDENT:ACTIVATED") && record.isDeleted,
//         onClick: (record) => {
//           setSelectedStudent(record);
//           activateConfirmRef.current?.show();
//         },
//       },
//     ],
//     [hasPermission, router],
//   );

//   return (
//     <BaseView>
//       <FilterComponent
//         fields={filterFields}
//         filters={filter}
//         onFiltersChange={handleFiltersChange}
//         onSearch={() => handleSearch(false)}
//         onClear={() => handleSearch(true)}
//       />

//       <TableCustom<StudentDto>
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
//         emptyText="Không tìm thấy student nào"
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
//               <PermissionGate permission="STUDENT:CREATED">
//                 <RowActions
//                   actions={[CommonActions.create(handleCreate)]}
//                   justify="start"
//                   gap="medium"
//                 />
//               </PermissionGate>

//               <PermissionGate permission="STUDENT:EXPORTED">
//                 <RowActions
//                   actions={[CommonActions.exportExcel(handleExportExcel)]}
//                   justify="start"
//                   gap="medium"
//                 />
//               </PermissionGate>

//               <PermissionGate permission="STUDENT:IMPORTED">
//                 <RowActions
//                   actions={[CommonActions.uploadExcel(handleDownloadTemplate, handleImportExcel)]}
//                   justify="start"
//                   gap="medium"
//                 />
//               </PermissionGate>
//             </>
//           ),
//           showRefreshButton: true,
//           onRefresh: refetch,
//         }}
//       />

//       <ActionConfirm
//         ref={activateConfirmRef}
//         title="Xác nhận kích hoạt student"
//         confirmText="Kích hoạt"
//         cancelText="Hủy"
//         onConfirm={handleActivate}
//       />

//       <ActionConfirm
//         ref={deactivateConfirmRef}
//         title="Xác nhận ngừng hoạt động student"
//         confirmText="Ngừng hoạt động"
//         cancelText="Hủy"
//         withReason={true}
//         isRequireReason={true}
//         onConfirm={handleDeactivate}
//       />
//     </BaseView>
//   );
// }
