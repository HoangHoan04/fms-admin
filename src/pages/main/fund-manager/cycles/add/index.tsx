import { type FormField, BaseView, FormCustom, GlobalLoading } from "@/components/ui";
import type { FundCycleDto } from "@/dto";
import { useFundDetail } from "@/hooks/fund";
import { useCreateFundCycle } from "@/hooks/fund-cycle";
import { useRouter } from "@/routers/hooks";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

function AddFundCyclePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo chu kỳ mới",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: Partial<FundCycleDto>;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { fundId } = useParams();
  const currentFundId = initData?.fundId || fundId || "";
  const router = useRouter();
  const { data: fund, isLoading: isLoadingFund } = useFundDetail(currentFundId);
  const { isLoading: isLoadingCreate, onCreateFundCycle } = useCreateFundCycle();

  const formFields = useMemo(
    (): FormField[] => [
      {
        name: "fundId",
        label: "Quỹ",
        type: "select",
        required: true,
        placeholder: "Chọn quỹ",
        options: fund
          ? [
              {
                id: fund.id,
                name: `${fund.code} - ${fund.name}`,
                value: fund.id,
              },
            ]
          : [],
        disabled: true,
      },
      {
        name: "name",
        label: "Tên chu kỳ",
        type: "input",
        required: true,
        placeholder: "VD: Kỳ tháng 6/2026",
      },
      {
        name: "cycleIndex",
        label: "Kỳ thứ",
        type: "number",
        required: true,
        placeholder: "Nhập số thứ tự kỳ",
      },
      {
        name: "contributionAmount",
        label: "Số tiền đóng/kỳ",
        type: "number",
        required: true,
        placeholder: "Nhập số tiền mỗi kỳ",
      },
      {
        name: "totalExpected",
        label: "Tổng dự thu",
        type: "number",
        placeholder: "contributionAmount × số thành viên",
      },
      {
        name: "startDate",
        label: "Ngày bắt đầu thu",
        type: "datepicker",
        placeholder: "Chọn ngày",
      },
      {
        name: "endDate",
        label: "Hạn chót đóng",
        type: "datepicker",
        placeholder: "Chọn ngày",
      },
      {
        name: "payoutDate",
        label: "Ngày giải ngân",
        type: "datepicker",
        placeholder: "Chọn ngày",
      },
      {
        name: "note",
        label: "Ghi chú",
        type: "textarea",
        placeholder: "Nhập ghi chú",
        gridColumn: "span 3",
      },
    ],
    [fund],
  );

  const handleSubmit = (values: any) => {
    if (!currentFundId) return;

    if (isEdit && handleUpdate) {
      handleUpdate(values);
      return;
    }
    onCreateFundCycle(values);
  };

  const goBack = () => {
    if (onCancel) {
      onCancel();
      return;
    }

    router.back();
  };

  if (isLoadingFund) return <GlobalLoading />;

  if (!currentFundId || !fund) {
    return (
      <BaseView>
        <Card title="Tạo chu kỳ mới">
          <p className="mb-4 text-sm text-gray-600">
            Bạn phải chọn một quỹ hợp lệ trước khi tạo chu kỳ.
          </p>
          <Button label="Quay lại" icon="pi pi-arrow-left" onClick={goBack} />
        </Card>
      </BaseView>
    );
  }

  return (
    <BaseView>
      <Card title={title} subTitle={`Thiết lập chu kỳ cho quỹ: ${fund.code} - ${fund.name}`}>
        <FormCustom
          showDivider={true}
          fields={formFields}
          initialValues={{ ...initData, fundId: currentFundId }}
          loading={isLoadingCreate || isLoadingUpdate}
          onSubmit={handleSubmit}
          onCancel={goBack}
          submitText={isEdit ? "Cập nhật" : "Lưu"}
          cancelText="Hủy"
          gridColumns={3}
        />
      </Card>
    </BaseView>
  );
}

export default AddFundCyclePage;
