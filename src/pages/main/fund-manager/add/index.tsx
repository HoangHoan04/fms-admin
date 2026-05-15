import { enumData } from "@/common/enums/enum";
import { FundMembersInput } from "@/components/layout";
import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { FundDto } from "@/dto";
import { useEmployeeSelectBox } from "@/hooks/employee";
import { useCreateFund } from "@/hooks/fund";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddFundPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới quỹ",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: FundDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateFund } = useCreateFund();
  const { data: employees } = useEmployeeSelectBox();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "name",
        label: "Tên quỹ",
        type: "input",
        required: true,
        placeholder: "Nhập tên quỹ",
      },

      {
        name: "contributionAmount",
        label: "Số tiền đóng mỗi kỳ",
        type: "number",
        required: true,
        placeholder: "Nhập số tiền mỗi kỳ",
        min: 0,
      },
      {
        name: "cycleType",
        label: "Loại chu kỳ",
        type: "select",
        required: true,
        placeholder: "Chọn loại chu kỳ",
        options: Object.values(enumData.CYCLE_TYPE).map((ct) => ({
          id: ct.id,
          name: ct.name,
          value: ct.value,
        })),
      },
      {
        name: "cycleDurationDays",
        label: "Số ngày mỗi chu kỳ",
        type: "number",
        placeholder: "Nhập số ngày (dùng cho chu kỳ tùy chỉnh)",
        min: 1,
      },
      {
        name: "maxRecipientPerCycle",
        label: "Số người nhận tối đa/kỳ",
        type: "number",
        placeholder: "Mặc định: 1",
        min: 1,
      },
      {
        name: "totalMembers",
        label: "Số thành viên dự kiến",
        type: "number",
        placeholder: "Nhập số thành viên",
        min: 1,
      },
      {
        name: "managedBy",
        label: "Nhân viên phụ trách",
        type: "select",
        placeholder: "Chọn nhân viên phụ trách",
        options: employees.map((epl) => ({
          id: epl.id,
          name: `${epl.code} - ${epl.fullName}`,
          value: epl.id,
        })),
      },
      {
        name: "startDate",
        label: "Ngày bắt đầu",
        type: "datepicker",
        placeholder: "Chọn ngày bắt đầu",
      },
      {
        name: "endDate",
        label: "Ngày kết thúc",
        type: "datepicker",
        placeholder: "Chọn ngày kết thúc",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        placeholder: "Nhập mô tả về quỹ",
        gridColumn: "span 3",
      },
      {
        name: "members",
        label: "Thành viên tham gia",
        type: "custom",
        required: false,
        gridColumn: "span 3",
        render: ({ value, onChange }) => (
          <FundMembersInput value={value || []} onChange={onChange} />
        ),
      },
    ];
  }, [employees]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateFund(values);
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

export default AddFundPage;
