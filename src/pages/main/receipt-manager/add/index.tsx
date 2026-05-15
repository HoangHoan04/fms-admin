import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { ReceiptDto } from "@/dto/receipt.dto";
import { useCreateReceipt } from "@/hooks/receipt";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddReceiptPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới biên lai",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: ReceiptDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateReceipt } = useCreateReceipt();
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
        name: "receiptDate",
        label: "Ngày biên lai",
        type: "datepicker",
        placeholder: "Chọn ngày biên lai",
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
      onCreateReceipt(values);
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

export default AddReceiptPage;
