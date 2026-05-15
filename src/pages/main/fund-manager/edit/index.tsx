import { useFundDetail, useUpdateFund } from "@/hooks/fund";
import { useParams } from "react-router-dom";
import AddFundPage from "../add";
import { GlobalLoading } from "@/components/ui";

function EditFundPage() {
  const { id } = useParams();
  const { data, isLoading } = useFundDetail(id);
  const { onUpdateFund, isLoading: isLoadingUpdate } = useUpdateFund();

  const handleUpdate = (values: any) => {
    onUpdateFund({ ...values, id });
  };

  return (
    <>
      {isLoading ? (
        <GlobalLoading />
      ) : (
        <AddFundPage
          isEdit={true}
          isLoadingUpdate={isLoadingUpdate}
          title="Chỉnh sửa quỹ"
          initData={data}
          handleUpdate={handleUpdate}
        />
      )}
    </>
  );
}

export default EditFundPage;
