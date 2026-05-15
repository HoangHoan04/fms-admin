import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { NotifyTemplateDto } from "@/dto";
import { useCreateTemplate } from "@/hooks/notification";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddNotifyTemplate({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới mẫu thông báo",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: NotifyTemplateDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateTemplate } = useCreateTemplate();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã mẫu",
        type: "input",
        required: true,
        placeholder: "VD: CONTRIBUTION_REMINDER",
        disabled: isEdit,
      },
      {
        name: "title",
        label: "Tiêu đề",
        type: "input",
        required: true,
        placeholder: "Hỗ trợ biến {{name}}, {{amount}},...",
      },
      {
        name: "body",
        label: "Nội dung",
        type: "textarea",
        placeholder: "Hỗ trợ biến {{cycle}}, {{dueDate}},...",
        gridColumn: "span 3",
      },
      {
        name: "channel",
        label: "Kênh gửi",
        type: "select",
        placeholder: "Chọn kênh gửi",
        options: [
          { id: "push", name: "Push", value: "push" },
          { id: "email", name: "Email", value: "email" },
          { id: "sms", name: "SMS", value: "sms" },
          { id: "all", name: "Tất cả", value: "all" },
        ],
      },
      {
        name: "eventType",
        label: "Loại sự kiện",
        type: "input",
        placeholder: "VD: member.created, contribution.confirmed",
      },
    ];
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateTemplate(values);
    }
  };

  const goBack = () => router.back();

  return (
    <BaseView>
      <FormCustom
        title={title}
        showDivider={true}
        fields={formFields}
        initialValues={initData}
        loading={isLoading || isLoadingUpdate}
        onSubmit={handleSubmit}
        onCancel={onCancel || goBack}
        submitText="Lưu"
        cancelText="Hủy"
        gridColumns={3}
      />
    </BaseView>
  );
}

export default AddNotifyTemplate;
