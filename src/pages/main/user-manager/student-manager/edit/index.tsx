// import { GlobalLoading } from "@/components/ui";
// import { useStudentDetail, useUpdateStudent } from "@/hooks/student";
// import { useParams } from "react-router-dom";
// import AddStudentPage from "../add";

// function EditStudentPage() {
//   const { id } = useParams();
//   const { data, isLoading } = useStudentDetail(id);
//   const { onUpdateStudent, isLoading: isLoadingUpdate } = useUpdateStudent();

//   const handleUpdate = (values: any) => {
//     onUpdateStudent({ ...values, id });
//   };

//   return (
//     <>
//       {isLoading ? (
//         <GlobalLoading />
//       ) : (
//         <AddStudentPage
//           isEdit={true}
//           isLoadingUpdate={isLoadingUpdate}
//           title="Chỉnh sửa học viên"
//           initData={data}
//           handleUpdate={handleUpdate}
//         />
//       )}
//     </>
//   );
// }

// export default EditStudentPage;
