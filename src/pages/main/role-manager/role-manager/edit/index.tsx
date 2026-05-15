import { useRoleDetail, useUpdateRole } from "@/hooks/role";
import { useParams } from "react-router-dom";
import AddRolePage from "../add";
import { GlobalLoading } from "@/components/ui";

function EditRolePage() {
  const { id } = useParams();
  const { data, isLoading } = useRoleDetail(id);
  const { onUpdateRole, isLoading: isLoadingUpdate } = useUpdateRole();

  const handleUpdate = (values: any) => {
    onUpdateRole({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddRolePage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa vai trò"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditRolePage;
