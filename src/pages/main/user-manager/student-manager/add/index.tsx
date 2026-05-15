// import { enumData } from "@/common/enums";
// import { type FormField, BaseView, FormCustom } from "@/components/ui";
// import type { StudentDto } from "@/dto";
// import { useCreateStudent } from "@/hooks/student";
// import { useRouter } from "@/routers/hooks";
// import { useMemo } from "react";

// function AddStudentPage({
//   initData,
//   isEdit = false,
//   handleUpdate,
//   title = "Tạo mới học viên",
//   isLoadingUpdate = false,
//   onCancel,
// }: {
//   initData?: StudentDto;
//   isEdit?: boolean;
//   handleUpdate?: (data: StudentDto) => void;
//   title?: string;
//   isLoadingUpdate?: boolean;
//   onCancel?: () => void;
// }) {
//   const { isLoading, onCreateStudent } = useCreateStudent();
//   const router = useRouter();

//   const formFields = useMemo((): FormField[] => {
//     return [
//       {
//         name: "code",
//         label: "Mã học viên",
//         type: "input",
//         placeholder: "Mã học viên tự động tạo khi tạo mới",
//         disabled: true,
//         maxLength: 255,
//       },
//       {
//         name: "fullName",
//         label: "Họ tên học viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập họ tên học viên",
//         disabled: isEdit,
//       },
//       {
//         name: "email",
//         label: "Email học viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập email học viên",
//       },
//       {
//         name: "phone",
//         label: "Số điện thoại học viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập số điện thoại học viên",
//       },
//       {
//         name: "gender",
//         label: "Giới tính học viên",
//         type: "select",
//         options: Object.values(enumData.GENDER).map((item) => ({
//           id: item.id,
//           name: item.name,
//           value: item.code,
//         })),
//       },
//       {
//         name: "birthday",
//         label: "Ngày sinh học viên",
//         type: "datepicker",
//         dateFormat: "DD/MM/YYYY",
//         placeholder: "Chọn ngày sinh học viên",
//       },
//       {
//         name: "school",
//         label: "Trường học",
//         type: "input",
//         placeholder: "Nhập trường học",
//       },
//       {
//         name: "occupation",
//         label: "Nghề nghiệp",
//         type: "input",
//         placeholder: "Nhập nghề nghiệp",
//       },
//       {
//         name: "targetCertId",
//         label: "Chứng chỉ mục tiêu",
//         type: "input",
//         placeholder: "Nhập chứng chỉ mục tiêu",
//       },
//       {
//         name: "targetScore",
//         label: "Điểm mục tiêu",
//         type: "input",
//         placeholder: "Nhập điểm mục tiêu",
//       },
//       {
//         name: "avatar",
//         label: "Ảnh đại diện",
//         type: "image",
//         isSingle: true,
//         required: false,
//         gridColumn: "span 3",
//       },
//     ];
//   }, [isEdit]);

//   const handleSubmit = (values: any) => {
//     if (isEdit && handleUpdate) {
//       handleUpdate(values);
//     } else {
//       onCreateStudent(values);
//     }
//   };

//   const goBack = () => {
//     router.back();
//   };

//   return (
//     <BaseView>
//       <FormCustom
//         title={title}
//         showDivider={true}
//         fields={formFields}
//         initialValues={initData}
//         loading={isLoading || isLoadingUpdate}
//         onSubmit={handleSubmit}
//         onCancel={goBack || onCancel}
//         submitText="Lưu"
//         cancelText="Hủy"
//         gridColumns={3}
//       />
//     </BaseView>
//   );
// }

// export default AddStudentPage;
