// import { enumData } from "@/common/enums";
// import { type FormField, BaseView, FormCustom } from "@/components/ui";
// import type { TeacherDto } from "@/dto";
// import { useCreateTeacher } from "@/hooks/teacher";
// import { useRouter } from "@/routers/hooks";
// import { useMemo } from "react";

// function AddTeacherPage({
//   initData,
//   isEdit = false,
//   handleUpdate,
//   title = "Tạo mới giảng viên",
//   isLoadingUpdate = false,
//   onCancel,
// }: {
//   initData?: TeacherDto;
//   isEdit?: boolean;
//   handleUpdate?: (data: TeacherDto) => void;
//   title?: string;
//   isLoadingUpdate?: boolean;
//   onCancel?: () => void;
// }) {
//   const { isLoading, onCreateTeacher } = useCreateTeacher();
//   const router = useRouter();

//   const formFields = useMemo((): FormField[] => {
//     return [
//       {
//         name: "code",
//         label: "Mã giảng viên",
//         type: "input",
//         placeholder: "Mã giảng viên tự động tạo khi tạo mới",
//         disabled: true,
//         maxLength: 255,
//       },
//       {
//         name: "fullName",
//         label: "Họ tên giảng viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập họ tên giảng viên",
//         disabled: isEdit,
//       },
//       {
//         name: "email",
//         label: "Email giảng viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập email giảng viên",
//       },
//       {
//         name: "phone",
//         label: "Số điện thoại giảng viên",
//         type: "input",
//         required: true,
//         placeholder: "Nhập số điện thoại giảng viên",
//       },
//       {
//         name: "gender",
//         label: "Giới tính giảng viên",
//         type: "select",
//         options: Object.values(enumData.GENDER).map((item) => ({
//           id: item.id,
//           name: item.name,
//           value: item.code,
//         })),
//       },
//       {
//         name: "birthday",
//         label: "Ngày sinh giảng viên",
//         type: "datepicker",
//         dateFormat: "DD/MM/YYYY",
//         placeholder: "Chọn ngày sinh giảng viên",
//       },

//       {
//         name: "specialties",
//         label: "Lĩnh vực chuyên môn",
//         type: "input",
//         placeholder: "Nhập lĩnh vực chuyên môn",
//       },
//       {
//         name: "certifications",
//         label: "Chứng chỉ",
//         type: "input",
//         placeholder: "Nhập chứng chỉ",
//       },
//       {
//         name: "yearsExperience",
//         label: "Số năm kinh nghiệm",
//         type: "number",
//         placeholder: "Nhập số năm kinh nghiệm",
//       },
//       {
//         name: "bio",
//         label: "Giới thiệu",
//         type: "textarea",
//         placeholder: "Nhập giới thiệu",
//         gridColumn: "span 3",
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
//       onCreateTeacher(values);
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

// export default AddTeacherPage;
