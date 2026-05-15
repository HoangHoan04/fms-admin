import { useParams } from "react-router-dom";
import { usePermissionDetail, useUpdatePermission } from "@/hooks/permission";
import AddPermissionPage from "../add";
import { GlobalLoading } from "@/components/ui";

export default function EditPermissionPage() {
  const { id } = useParams();
  const { data, isLoading } = usePermissionDetail(id);
  const { onUpdatePermission, isLoading: isUpdating } = useUpdatePermission();

  if (isLoading) return <GlobalLoading />;

  const handleUpdate = (values: any) => {
    if (id) {
      onUpdatePermission({ ...values, id });
    }
  };

  return (
    <AddPermissionPage
      initData={data}
      isEdit={true}
      title="Chỉnh sửa quyền"
      handleUpdate={handleUpdate}
      isLoadingUpdate={isUpdating}
    />
  );
}
