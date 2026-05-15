import { type FormField, BaseView, FormCustom } from "@/components/ui";
import type { RoleDto } from "@/dto/role.dto";
import { useCreateRole } from "@/hooks/role";
import { useRouter } from "@/routers/hooks";
import { useMemo } from "react";

function AddRolePage({
  initData,
  isEdit = false,
  handleUpdate,
  title = "Tạo mới vai trò",
  isLoadingUpdate = false,
  onCancel,
}: {
  initData?: RoleDto;
  isEdit?: boolean;
  handleUpdate?: (data: any) => void;
  title?: string;
  isLoadingUpdate?: boolean;
  onCancel?: () => void;
}) {
  const { isLoading, onCreateRole } = useCreateRole();
  const router = useRouter();

  const formFields = useMemo((): FormField[] => {
    return [
      {
        name: "code",
        label: "Mã vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập mã vai trò (VD: ADMIN, TEACHER...)",
        disabled: isEdit,
      },
      {
        name: "name",
        label: "Tên vai trò",
        type: "input",
        required: true,
        placeholder: "Nhập tên hiển thị của vai trò",
      },
      {
        name: "description",
        label: "Mô tả",
        type: "textarea",
        placeholder: "Nhập mô tả về vai trò này",
        gridColumn: "span 3",
      },
    ];
  }, [isEdit]);

  const handleSubmit = (values: any) => {
    if (isEdit && handleUpdate) {
      handleUpdate(values);
    } else {
      onCreateRole(values);
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

export default AddRolePage;
