import { enumData } from "@/common/enums";
import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { EmployeeDto } from "@/dto/employee.dto";
import { useCreateEmployee } from "@/hooks/employee";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

const genderOptions = Object.values(enumData.GENDER).map((g) => ({
  id: g.code,
  name: g.name,
  value: g.code,
}));

function AddEmployeePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới nhân viên",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: EmployeeDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateEmployee } = useCreateEmployee();
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
        type: "input",
        required: true,
        placeholder: "Nhập email",
      },
      {
        name: "phone",
        label: "Số điện thoại",
        type: "input",
        placeholder: "Nhập số điện thoại",
      },
      {
        name: "gender",
        label: "Giới tính",
        type: "select",
        placeholder: "Chọn giới tính",
        options: genderOptions,
      },
      {
        name: "birthday",
        label: "Ngày sinh",
        type: "datepicker",
        placeholder: "Chọn ngày sinh",
      },
      {
        name: "bio",
        label: "Giới thiệu",
        type: "textarea",
        placeholder: "Nhập giới thiệu về nhân viên",
        gridColumn: "span 3",
      },
    ];
  }, []);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateEmployee(values);
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

export default AddEmployeePage;
