import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { ContributionDto } from "@/dto/contribution.dto";
import { useCreateContribution } from "@/hooks/contribution";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddContributionPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới đóng góp",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: ContributionDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateContribution } = useCreateContribution();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "fundId",
        label: "Mã quỹ",
        type: "input",
        required: true,
        placeholder: "Nhập mã quỹ",
      },
      {
        name: "memberId",
        label: "Mã thành viên",
        type: "input",
        required: true,
        placeholder: "Nhập mã thành viên",
      },
      {
        name: "amount",
        label: "Số tiền",
        type: "number",
        required: true,
        placeholder: "Nhập số tiền",
      },
      {
        name: "contributionDate",
        label: "Ngày đóng góp",
        type: "datepicker",
        placeholder: "Chọn ngày đóng góp",
      },
      {
        name: "note",
        label: "Ghi chú",
        type: "textarea",
        placeholder: "Nhập ghi chú",
        gridColumn: "span 3",
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateContribution(values);
    }
  };

  const goBack = () => {
    router.back();
  };

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

export default AddContributionPage;
