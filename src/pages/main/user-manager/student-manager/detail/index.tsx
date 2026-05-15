// import { ROUTES } from "@/common/constants";
// import { enumData } from "@/common/enums";
// import { formatDate } from "@/common/helpers";
// import { BaseView, DocumentFile, GlobalLoading, StatusTag, Title } from "@/components/ui";
// import ActionLog from "@/components/ui/ActionLog";
// import { useStudentDetail } from "@/hooks/student";
// import { useRouter } from "@/routers/hooks";
// import { PrimeIcons } from "primereact/api";
// import { Button } from "primereact/button";
// import { Card } from "primereact/card";
// import { useParams } from "react-router-dom";

// export default function DetailStudentPage() {
//   const { id } = useParams();
//   const router = useRouter();
//   const { data, isLoading } = useStudentDetail(id);

//   if (isLoading) {
//     return <GlobalLoading />;
//   }

//   if (!data) {
//     return (
//       <BaseView>
//         <div className="flex h-full flex-col items-center justify-center gap-4">
//           <p className="font-medium">Không tìm thấy thông tin học viên</p>
//           <Button
//             label="Quay lại danh sách"
//             icon={PrimeIcons.ARROW_LEFT}
//             size="small"
//             onClick={() => router.back()}
//           />
//         </div>
//       </BaseView>
//     );
//   }

//   const renderDetailView = () => {
//     const genderObj = enumData.GENDER[data.gender as keyof typeof enumData.GENDER];
//     const genderName = genderObj ? genderObj.name : "---";

//     const avatarDocuments =
//       data.avatar && data.avatar.length > 0
//         ? data.avatar.map((item: any) => ({
//             id: item.id || "avatar",
//             fileName: item.fileName || "Hinh_anh_dai_dien",
//             fileUrl: item.fileUrl,
//           }))
//         : data.avatarUrl
//           ? [
//               {
//                 id: "avatar",
//                 fileName: data.fullName ? `Avatar_${data.fullName}` : "Hinh_anh_dai_dien",
//                 fileUrl: data.avatarUrl,
//               },
//             ]
//           : [];

//     return (
//       <div className="flex flex-col gap-6 p-6">
//         <div className="pt-2 pb-1">
//           <Title>Xem chi tiết học viên</Title>
//         </div>

//         <Card
//           pt={{
//             title: { className: "text-lg font-bold border-b pb-3 m-0" },
//             body: { className: "p-6" },
//           }}
//           title="I. Thông tin học viên"
//           className="rounded-xl border border-gray-100 shadow-xs"
//         >
//           <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Mã học viên</span>
//               <span className="text-lg font-bold">{data.code}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Tên học viên</span>
//               <span className="text-lg font-bold">{data.fullName}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Giới tính</span>
//               <span className="text-lg font-bold">{genderName}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Ngày sinh</span>
//               <span className="text-lg font-bold">{formatDate(data.birthday)}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Số điện thoại</span>
//               <span className="text-lg font-bold">{data.phone}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Email</span>
//               <span className="text-lg font-bold break-all">{data.email}</span>
//             </div>
//           </div>
//         </Card>

//         <Card
//           pt={{
//             title: { className: "text-lg font-bold border-b pb-3 m-0" },
//             body: { className: "p-6" },
//           }}
//           title="II. Học tập & Mục tiêu"
//           className="rounded-xl border border-gray-100 shadow-xs"
//         >
//           <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Trường học</span>
//               <span className="text-lg font-bold">{data.school || "Không có thông tin"}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Nghề nghiệp</span>
//               <span className="text-lg font-bold">{data.occupation || "Không có thông tin"}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Chứng chỉ mục tiêu</span>
//               <span className="text-lg font-bold">{data.targetCertId || "Không có thông tin"}</span>
//             </div>

//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Điểm mục tiêu</span>
//               <span className="text-lg font-bold">{data.targetScore || "Không có thông tin"}</span>
//             </div>
//           </div>
//         </Card>

//         <Card
//           pt={{
//             title: { className: "text-lg font-bold border-b pb-3 m-0" },
//             body: { className: "p-6" },
//           }}
//           title="III. Hình ảnh"
//           className="rounded-xl border border-gray-100 shadow-xs"
//         >
//           <div className="flex flex-col gap-2">
//             <span className="text-sm font-semibold">Ảnh đại diện</span>
//             <div className="mt-1">
//               <DocumentFile documents={avatarDocuments} />
//             </div>
//           </div>
//         </Card>

//         <div className="mt-4 flex items-center justify-center gap-4">
//           <Button
//             label="Thoát"
//             severity="secondary"
//             outlined
//             className="px-6"
//             onClick={() => router.back()}
//           />
//           {!data.isDeleted && (
//             <Button
//               label="Chỉnh sửa"
//               icon={PrimeIcons.PENCIL}
//               className="px-6"
//               onClick={() =>
//                 router.push(
//                   ROUTES.MAIN.USER_MANAGER.children.STUDENT_MANAGER.children.EDIT_STUDENT.path.replace(
//                     ":id",
//                     data.id,
//                   ),
//                 )
//               }
//             />
//           )}
//         </div>
//       </div>
//     );
//   };

//   const renderAccountView = () => {
//     return (
//       <div className="p-6">
//         <Card
//           pt={{
//             title: { className: "text-lg font-bold border-b pb-3 m-0" },
//             body: { className: "p-6" },
//           }}
//           title="Thông tin tài khoản"
//           className="rounded-xl border border-gray-100 bg-gray-50/50 shadow-xs"
//         >
//           <div className="grid grid-cols-1 gap-x-4 gap-y-6 md:grid-cols-3">
//             <div className="flex flex-col gap-1">
//               <span className="text-sm font-semibold">Tên đăng nhập</span>
//               <span className="text-lg font-bold">{data?.user?.username}</span>
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Trạng thái</span>
//               <StatusTag
//                 severity={data?.user?.isActive ? "success" : "danger"}
//                 value={data?.user?.isActive ? "Đang hoạt động" : "Ngưng hoạt động"}
//                 style={{ fontSize: "14px", padding: "4px 12px" }}
//               />
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Quyền quản trị</span>
//               <StatusTag
//                 severity={data?.user?.isAdmin ? "warning" : "info"}
//                 value={data?.user?.isAdmin ? "Admin" : "User thường"}
//                 style={{ fontSize: "14px", padding: "4px 12px" }}
//               />
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Là học viên</span>
//               <StatusTag
//                 severity={data?.user?.studentId ? "success" : "danger"}
//                 value={data?.user?.studentId ? "Có" : "Không"}
//                 style={{ fontSize: "14px", padding: "4px 12px" }}
//               />
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Là giảng viên</span>
//               <StatusTag
//                 severity={data?.user?.teacherId ? "success" : "danger"}
//                 value={data?.user?.teacherId ? "Có" : "Không"}
//                 style={{ fontSize: "14px", padding: "4px 12px" }}
//               />
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Đăng nhập bằng</span>
//               <StatusTag
//                 severity={
//                   data?.user?.googleId
//                     ? "success"
//                     : data?.user?.facebookId
//                       ? "info"
//                       : data?.user?.zaloId
//                         ? "info"
//                         : "info"
//                 }
//                 value={
//                   data?.user?.googleId
//                     ? "Google"
//                     : data?.user?.facebookId
//                       ? "Facebook"
//                       : data?.user?.zaloId
//                         ? "Zalo"
//                         : "Đăng ký"
//                 }
//                 style={{ fontSize: "14px", padding: "4px 12px" }}
//               />
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Ngày tạo tài khoản</span>
//               <span className="text-lg font-bold">
//                 {data?.user?.createdAt ? formatDate(data.user.createdAt) : "---"}
//               </span>
//             </div>

//             <div className="flex flex-col items-start gap-1">
//               <span className="mb-1 text-sm font-semibold">Ngày cập nhật tài khoản</span>
//               <span className="text-lg font-bold">
//                 {data?.user?.updatedAt ? formatDate(data.user.updatedAt) : "---"}
//               </span>
//             </div>
//           </div>
//         </Card>
//       </div>
//     );
//   };

//   const tabs = [
//     {
//       key: "1",
//       title: "Chi tiết",
//       icon: PrimeIcons.USER,
//       content: renderDetailView(),
//     },
//     {
//       key: "2",
//       title: "Thông tin tài khoản",
//       icon: PrimeIcons.ID_CARD,
//       content: renderAccountView(),
//     },
//     {
//       key: "3",
//       title: "Lịch sử thao tác",
//       icon: PrimeIcons.HISTORY,
//       content: (
//         <div className="h-full py-4">
//           <Card className="h-full rounded-xl border border-gray-100 shadow-xs">
//             <ActionLog functionType="Students" functionId={data.id} />
//           </Card>
//         </div>
//       ),
//     },
//   ];

//   return <BaseView tabs={tabs} />;
// }
