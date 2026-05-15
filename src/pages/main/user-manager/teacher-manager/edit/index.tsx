// import { GlobalLoading } from "@/components/ui";
// import { useTeacherDetail, useUpdateTeacher } from "@/hooks/teacher";
// import { useParams } from "react-router-dom";
// import AddTeacherPage from "../add";

// function EditTeacherPage() {
//   const { id } = useParams();
//   const { data, isLoading } = useTeacherDetail(id);
//   const { onUpdateTeacher, isLoading: isLoadingUpdate } = useUpdateTeacher();

//   const handleUpdate = (values: any) => {
//     onUpdateTeacher({ ...values, id });
//   };

//   return (
//     <>
//       {isLoading ? (
//         <GlobalLoading />
//       ) : (
//         <AddTeacherPage
//           isEdit={true}
//           isLoadingUpdate={isLoadingUpdate}
//           title="Chỉnh sửa giảng viên"
//           initData={data}
//           handleUpdate={handleUpdate}
//         />
//       )}
//     </>
//   );
// }

// export default EditTeacherPage;
