import { enumData } from "@/common/enums";
import { type FormField, BankAccountInput, BaseView, FormCustom } from "@/components";
import type { MemberDto } from "@/dto/member.dto";
import { useCreateMember } from "@/hooks/member";
import { useRouter } from "@/routers/hooks";
import { normalizePhoneNumber } from "@/utils";
import { useMemo } from "react";

function AddMemberPage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới thành viên",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: MemberDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateMember } = useCreateMember();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "fullName",
        label: "Họ và tên",
        type: "input",
        required: true,
        placeholder: "Nhập họ và tên",
      },
      {
        name: "email",
        label: "Email",
        type: "email",
        required: true,
        placeholder: "Nhập địa chỉ email",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "phoneNumber",
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        placeholder: "Chọn giới tính",
        options: Object.values(enumData.GENDER).map((gender) => ({
          id: gender.id,
          name: gender.name,
          value: gender.code,
        })),
      },
      {
        name: "birthday",
        label: "Ngày sinh",
        type: "datepicker",
        placeholder: "Chọn ngày sinh",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        placeholder: "Nhập thông tin Mô tả",
        gridColumn: "span 3",
      },
      {
        name: "avatar",
        label: "Ảnh đại diện",
        type: "image",
        isSingle: true,
        placeholder: "Nhập thông tin avatar",
        gridColumn: "span 3",
      },
      {
        name: "bankAccounts",
        label: "Tài khoản ngân hàng",
        type: "custom",
        required: false,
        gridColumn: "span 3",
        render: ({ value, onChange }) => (
          <BankAccountInput value={value || []} onChange={onChange} />
        ),
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    const payload = {
      ...values,
      phone: normalizePhoneNumber(values.phone),
    };
    if (isEdit && handleUpdate) {
      handleUpdate(payload);
    } else {
      onCreateMember(payload);
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

export default AddMemberPage;
