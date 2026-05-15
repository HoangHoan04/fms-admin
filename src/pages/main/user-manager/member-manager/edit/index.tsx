import { useMemberDetail, useUpdateMember } from "@/hooks/member";
import { useParams } from "react-router-dom";
import AddMemberPage from "../add";
import { GlobalLoading } from "@/components/ui";

function EditMemberPage() {
  const { id } = useParams();
  const { data, isLoading } = useMemberDetail(id);
  const { onUpdateMember, isLoading: isLoadingUpdate } = useUpdateMember();

  const handleUpdate = (values: any) => {
    onUpdateMember({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddMemberPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa thành viên"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditMemberPage;
