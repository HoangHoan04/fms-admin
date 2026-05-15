import { GlobalLoading } from "@/components/ui";
import { useTemplateDetail, useUpdateTemplate } from "@/hooks/notification";
import { useParams } from "react-router-dom";
import AddNotifyTemplate from "../add";

export default function EditNotifyTemplate() {
  const { id } = useParams();
  const { data, isLoading } = useTemplateDetail(id);
  const { onUpdateTemplate, isLoading: isLoadingUpdate } = useUpdateTemplate();

  if (isLoading) return <GlobalLoading />;

  return (
    <AddNotifyTemplate
      isEdit={true}
      initData={data}
      handleUpdate={(values) => onUpdateTemplate({ ...values, id })}
      isLoadingUpdate={isLoadingUpdate}
      title="Chỉnh sửa mẫu thông báo"
    />
  );
}
