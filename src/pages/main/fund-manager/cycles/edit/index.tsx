import { BaseView, GlobalLoading } from "@/components/ui";
import { useFundCycleDetail, useUpdateFundCycle } from "@/hooks/fund-cycle";
import { useRouter } from "@/routers/hooks";
import { useParams } from "react-router-dom";
import AddFundCyclePage from "../add";

function EditFundCyclePage() {
  const { id } = useParams();
  const { data: cycle, isLoading } = useFundCycleDetail(id);
  const { onUpdateFundCycle, isLoading: isLoadingUpdate } = useUpdateFundCycle();
  const router = useRouter();

  if (isLoading) return <GlobalLoading />;

  if (!cycle)
    return (
      <BaseView>
        <p>Không tìm thấy chu kỳ</p>
      </BaseView>
    );

  return (
    <AddFundCyclePage
      initData={cycle}
      isEdit={true}
      title={`Chỉnh sửa chu kỳ: ${cycle.name}`}
      isLoadingUpdate={isLoadingUpdate}
      handleUpdate={(values) => onUpdateFundCycle({ ...values, id: cycle.id })}
      onCancel={() => router.back()}
    />
  );
}

export default EditFundCyclePage;
